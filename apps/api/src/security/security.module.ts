import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { SecurityService } from './security.service';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { BruteForceGuard } from './guards/brute-force.guard';
import { IPWhitelistGuard } from './guards/ip-whitelist.guard';
import { SecurityMiddleware } from './middleware/security.middleware';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // 1 minute default
      max: 1000, // maximum number of items in cache
    }),
    ConfigModule,
  ],
  providers: [
    SecurityService,
    RateLimitGuard,
    BruteForceGuard,
    IPWhitelistGuard,
    SecurityMiddleware,
  ],
  exports: [
    CacheModule,
    SecurityService,
    RateLimitGuard,
    BruteForceGuard,
    IPWhitelistGuard,
    SecurityMiddleware,
  ],
})
export class SecurityModule {}
