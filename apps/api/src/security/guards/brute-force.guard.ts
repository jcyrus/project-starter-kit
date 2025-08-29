import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SecurityService } from '../security.service';
import { Request } from 'express';

@Injectable()
export class BruteForceGuard implements CanActivate {
  constructor(private readonly securityService: SecurityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIP(request);

    // Get email from request body (for login endpoints)
    const email = request.body?.email;

    if (!email) {
      // If no email, just check IP allowlist
      return this.securityService.isIPAllowed(ip);
    }

    // Check if account is locked out
    const isLockedOut = await this.securityService.isAccountLockedOut(email);

    if (isLockedOut) {
      // Record this as a failed attempt on locked account
      await this.securityService.recordLoginAttempt(
        ip,
        email,
        false,
        request.headers['user-agent'] || 'unknown',
      );
      return false;
    }

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
