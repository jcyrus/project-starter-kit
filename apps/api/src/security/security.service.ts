import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  SecurityConfig,
  LoginAttempt,
  SecurityEvent,
  ClientIdentifier,
  AccountLockout,
} from './interfaces/security.interfaces';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly config: SecurityConfig;

  constructor(
    private readonly configService: ConfigService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {
    this.config = {
      maxLoginAttempts: parseInt(
        this.configService.get<string>('MAX_LOGIN_ATTEMPTS', '5'),
      ),
      lockoutDuration: parseInt(
        this.configService.get<string>('LOCKOUT_DURATION', '15'),
      ),
      allowedIPs: this.configService
        .get<string>('ALLOWED_IPS', '')
        .split(',')
        .filter(Boolean),
      blockedIPs: this.configService
        .get<string>('BLOCKED_IPS', '')
        .split(',')
        .filter(Boolean),
      requireStrongPasswords: this.configService.get<boolean>(
        'REQUIRE_STRONG_PASSWORDS',
        true,
      ),
      sessionTimeout: parseInt(
        this.configService.get<string>('SESSION_TIMEOUT', '480'),
      ),
      throttleSettings: {
        short: {
          ttl: parseInt(
            this.configService.get<string>('THROTTLE_TTL', '60000'),
          ),
          limit: parseInt(
            this.configService.get<string>('THROTTLE_LIMIT', '30'),
          ),
        },
        medium: {
          ttl: parseInt(
            this.configService.get<string>('THROTTLE_TTL_MEDIUM', '300000'),
          ),
          limit: parseInt(
            this.configService.get<string>('THROTTLE_LIMIT_MEDIUM', '100'),
          ),
        },
        login: {
          ttl: 60000, // 1 minute
          limit: 5,
        },
        refresh: {
          ttl: 60000, // 1 minute
          limit: 10,
        },
      },
    };
  }

  /**
   * Record a login attempt
   */
  async recordLoginAttempt(
    ip: string,
    email: string,
    success: boolean,
    userAgent: string,
  ): Promise<void> {
    const attempt: LoginAttempt = {
      ip,
      email,
      timestamp: new Date(),
      success,
      userAgent,
    };

    // Store in cache with 24 hour expiration
    const key = `login_attempt:${ip}:${email}:${Date.now()}`;
    await this.cacheManager.set(key, attempt, 24 * 60 * 60 * 1000);

    // Log security event
    await this.logSecurityEvent({
      type: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      ip,
      userAgent,
      email,
      timestamp: new Date(),
      details: { attempt },
    });

    // Handle failed attempts
    if (!success) {
      await this.handleFailedLogin(ip, email);
    }
  }

  /**
   * Check if an account is locked out
   */
  async isAccountLockedOut(email: string): Promise<boolean> {
    const lockoutKey = `account_lockout:${email}`;
    const lockout: AccountLockout | undefined =
      await this.cacheManager.get(lockoutKey);

    if (!lockout) {
      return false;
    }

    if (new Date() > lockout.lockedUntil) {
      // Lockout expired, remove it
      await this.cacheManager.del(lockoutKey);
      return false;
    }

    return true;
  }

  /**
   * Check if IP is allowed
   */
  isIPAllowed(ip: string): boolean {
    // If no allowed IPs specified, allow all
    if (this.config.allowedIPs.length === 0) {
      return !this.config.blockedIPs.includes(ip);
    }

    // Check whitelist
    return (
      this.config.allowedIPs.includes(ip) &&
      !this.config.blockedIPs.includes(ip)
    );
  }

  /**
   * Generate client identifier hash
   */
  generateClientIdentifier(ip: string, userAgent: string): ClientIdentifier {
    const userAgentHash = crypto
      .createHash('sha256')
      .update(userAgent)
      .digest('hex')
      .substring(0, 16);

    return {
      ip,
      userAgentHash,
    };
  }

  /**
   * Get rate limit key for client
   */
  getRateLimitKey(prefix: string, clientId: ClientIdentifier): string {
    return `${prefix}:${clientId.ip}:${clientId.userAgentHash}`;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): boolean {
    if (!this.config.requireStrongPasswords) {
      return true;
    }

    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Block IP address dynamically
   */
  async blockIP(ip: string, reason: string): Promise<void> {
    this.config.blockedIPs.push(ip);
    await this.cacheManager.set(
      `blocked_ip:${ip}`,
      { reason, timestamp: new Date() },
      24 * 60 * 60 * 1000,
    );

    await this.logSecurityEvent({
      type: 'IP_BLOCKED',
      ip,
      userAgent: 'system',
      timestamp: new Date(),
      details: { reason },
    });

    this.logger.warn(`IP ${ip} blocked: ${reason}`);
  }

  /**
   * Get security configuration
   */
  getSecurityConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Handle failed login attempt
   */
  private async handleFailedLogin(ip: string, email: string): Promise<void> {
    const failedAttemptsKey = `failed_attempts:${email}`;
    const currentAttempts: number =
      (await this.cacheManager.get(failedAttemptsKey)) || 0;
    const newAttempts = currentAttempts + 1;

    await this.cacheManager.set(
      failedAttemptsKey,
      newAttempts,
      this.config.lockoutDuration * 60 * 1000,
    );

    if (newAttempts >= this.config.maxLoginAttempts) {
      const lockoutUntil = new Date(
        Date.now() + this.config.lockoutDuration * 60 * 1000,
      );

      const lockout: AccountLockout = {
        email,
        lockedUntil: lockoutUntil,
        attempts: newAttempts,
      };

      await this.cacheManager.set(
        `account_lockout:${email}`,
        lockout,
        this.config.lockoutDuration * 60 * 1000,
      );

      this.logger.warn(
        `Account ${email} locked out until ${lockoutUntil.toISOString()} after ${newAttempts} failed attempts`,
      );

      // Consider blocking IP if too many different accounts are being attacked
      await this.checkForIPBlocking(ip);
    }
  }

  /**
   * Check if IP should be blocked based on failed attempts across accounts
   */
  private async checkForIPBlocking(ip: string): Promise<void> {
    const ipAttemptsKey = `ip_attempts:${ip}`;
    const ipAttempts: number =
      (await this.cacheManager.get(ipAttemptsKey)) || 0;
    const newIpAttempts = ipAttempts + 1;

    await this.cacheManager.set(
      ipAttemptsKey,
      newIpAttempts,
      15 * 60 * 1000, // 15 minutes
    );

    // Block IP if more than 20 failed attempts from same IP in 15 minutes
    if (newIpAttempts > 20) {
      await this.blockIP(ip, 'Too many failed login attempts across accounts');
    }
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const eventKey = `security_event:${Date.now()}:${Math.random()}`;
    await this.cacheManager.set(eventKey, event, 7 * 24 * 60 * 60 * 1000); // 7 days

    this.logger.log(`Security Event: ${event.type} from ${event.ip}`, {
      type: event.type,
      ip: event.ip,
      email: event.email,
      userAgent: event.userAgent,
      details: event.details,
    });
  }
}
