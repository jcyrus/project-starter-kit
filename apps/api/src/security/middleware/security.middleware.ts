import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly helmetMiddleware;

  constructor() {
    this.helmetMiddleware = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'same-origin' },
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    // Apply helmet security headers
    this.helmetMiddleware(req, res, (err?: any) => {
      if (err) {
        return next(err);
      }

      // Add custom security headers
      res.setHeader('X-API-Version', '1.0');
      res.setHeader('X-Response-Time', Date.now());

      // Remove server information
      res.removeHeader('X-Powered-By');

      next();
    });
  }
}
