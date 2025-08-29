import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import { SecurityService } from '../security.service';
import { Request } from 'express';

export const RATE_LIMIT_KEY = 'rate_limit';

export interface RateLimitOptions {
  type?: 'short' | 'medium' | 'login' | 'refresh';
  skipIf?: (context: ExecutionContext) => boolean;
}

export const RateLimit = (options: RateLimitOptions = {}) =>
  Reflect.metadata(RATE_LIMIT_KEY, options);

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly securityService: SecurityService,
    private readonly reflector: Reflector,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIP(request);

    // Check if IP is allowed
    if (!this.securityService.isIPAllowed(ip)) {
      await this.securityService.recordLoginAttempt(
        ip,
        'unknown',
        false,
        request.headers['user-agent'] || 'unknown',
      );
      return false;
    }

    // Get rate limit configuration
    const rateLimitOptions: RateLimitOptions =
      this.reflector.get(RATE_LIMIT_KEY, context.getHandler()) || {};

    // Skip if condition is met
    if (rateLimitOptions.skipIf && rateLimitOptions.skipIf(context)) {
      return true;
    }

    // Apply rate limiting based on type
    const limitType = rateLimitOptions.type || 'short';
    const config = this.securityService.getSecurityConfig();
    const throttleConfig = config.throttleSettings[limitType];

    // Generate client identifier
    const clientId = this.securityService.generateClientIdentifier(
      ip,
      request.headers['user-agent'] || 'unknown',
    );

    const key = this.securityService.getRateLimitKey(
      `throttle_${limitType}`,
      clientId,
    );

    // Get current hits
    const hits = (await this.cacheManager.get<number>(key)) || 0;

    if (hits >= throttleConfig.limit) {
      // Log rate limit violation
      await this.securityService.recordLoginAttempt(
        ip,
        'rate_limited',
        false,
        request.headers['user-agent'] || 'unknown',
      );
      return false;
    }

    // Increment hit counter
    await this.cacheManager.set(key, hits + 1, throttleConfig.ttl);
    return true;
  }

  private getClientIP(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }
}
