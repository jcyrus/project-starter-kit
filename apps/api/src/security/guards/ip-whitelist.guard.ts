import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecurityService } from '../security.service';
import { Request } from 'express';

export const SKIP_IP_CHECK_KEY = 'skip_ip_check';

export const SkipIPCheck = () => Reflect.metadata(SKIP_IP_CHECK_KEY, true);

@Injectable()
export class IPWhitelistGuard implements CanActivate {
  constructor(
    private readonly securityService: SecurityService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if IP check should be skipped for this endpoint
    const skipIPCheck = this.reflector.get<boolean>(
      SKIP_IP_CHECK_KEY,
      context.getHandler(),
    );

    if (skipIPCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIP(request);

    const isAllowed = this.securityService.isIPAllowed(ip);

    if (!isAllowed) {
      // Log blocked IP attempt
      await this.securityService.recordLoginAttempt(
        ip,
        'blocked_ip_attempt',
        false,
        request.headers['user-agent'] || 'unknown',
      );
    }

    return isAllowed;
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
