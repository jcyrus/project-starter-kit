import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimit, RateLimitGuard } from '../security/guards/rate-limit.guard';
import { BruteForceGuard } from '../security/guards/brute-force.guard';
import { IPWhitelistGuard } from '../security/guards/ip-whitelist.guard';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(IPWhitelistGuard, RateLimitGuard)
  @RateLimit({ type: 'medium' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(IPWhitelistGuard, BruteForceGuard, RateLimitGuard, LocalAuthGuard)
  @RateLimit({ type: 'login' })
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    const ip = this.getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.authService.login(loginDto, ip, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  private getClientIP(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }
}
