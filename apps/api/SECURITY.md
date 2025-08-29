# 🔒 Security Implementation Guide

## Overview

This document provides a comprehensive guide to the security features implemented in the NestJS API application. The security layer includes advanced protection mechanisms against common web application vulnerabilities and attacks.

## 🛡️ Security Features

### 1. Rate Limiting & Throttling

- **Global Rate Limiting**: 30 requests per minute (short-term), 100 requests per 5 minutes (medium-term)
- **Login Rate Limiting**: 5 login attempts per minute per IP
- **Registration Rate Limiting**: Uses medium-term limits for registration endpoints
- **Advanced Client Tracking**: IP + User Agent hash for better client identification

### 2. Brute Force Protection

- **Login Attempt Tracking**: Records all login attempts with IP, email, timestamp, and success status
- **Account Lockout**: 5 failed attempts = 15-minute lockout
- **Cache-Based Storage**: Uses in-memory cache for fast lookup and automatic cleanup
- **IP-Based Protection**: Automatically blocks IPs with excessive failed attempts across multiple accounts

### 3. IP Whitelisting/Blacklisting

- **Configurable IP Management**: Allow/block specific IP addresses
- **Dynamic IP Blocking**: Automatically block IPs with suspicious activity
- **Flexible Configuration**: Can whitelist specific IPs or allow all (default)

### 4. Security Headers & Middleware

- **Helmet Integration**: Adds comprehensive security headers
  - HSTS (HTTP Strict Transport Security)
  - CSP (Content Security Policy)
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
- **CORS Protection**: Configurable cross-origin resource sharing
- **Request Sanitization**: Protects against XSS and injection attacks

### 5. Advanced Authentication

- **JWT with Refresh Tokens**: Secure token-based authentication
- **Security Event Logging**: All authentication events logged with IP and user agent
- **Session Management**: Configurable session timeouts

## 📁 File Structure

```
apps/api/src/security/
├── security.module.ts              # Main security module
├── security.service.ts             # Core security service
├── interfaces/
│   └── security.interfaces.ts      # TypeScript interfaces
├── middleware/
│   └── security.middleware.ts      # Helmet and CORS middleware
└── guards/
    ├── rate-limit.guard.ts         # Advanced rate limiting
    ├── brute-force.guard.ts        # Login attempt protection
    └── ip-whitelist.guard.ts       # IP-based access control
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Security Configuration
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15
SESSION_TIMEOUT=480
REQUIRE_STRONG_PASSWORDS=true

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=30
THROTTLE_TTL_MEDIUM=300000
THROTTLE_LIMIT_MEDIUM=100

# IP Configuration (comma-separated, empty means allow all)
ALLOWED_IPS=
BLOCKED_IPS=
```

### Security Service Configuration

The `SecurityService` provides centralized configuration:

```typescript
private readonly config: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15, // 15 minutes
  allowedIPs: [], // Empty means all IPs allowed
  blockedIPs: [],
  requireStrongPasswords: true,
  sessionTimeout: 480, // 8 hours
  throttleSettings: {
    short: { ttl: 60000, limit: 30 },
    medium: { ttl: 300000, limit: 100 },
    login: { ttl: 60000, limit: 5 },
    refresh: { ttl: 60000, limit: 10 },
  },
};
```

## 🚀 API Endpoints with Security

### Authentication Endpoints

#### POST /auth/login

- **Security**: Rate limited (5/min), brute force protected, IP filtered
- **Guards**: `IPWhitelistGuard`, `BruteForceGuard`, `RateLimitGuard`, `LocalAuthGuard`
- **Rate Limit**: Login type (5 attempts per minute)

#### POST /auth/register

- **Security**: Rate limited, IP filtered
- **Guards**: `IPWhitelistGuard`, `RateLimitGuard`
- **Rate Limit**: Medium type (100 attempts per 5 minutes)

#### GET /auth/profile

- **Security**: JWT protected
- **Guards**: `JwtAuthGuard`

## 🔍 Security Monitoring

### Login Attempt Tracking

```typescript
interface LoginAttempt {
  ip: string;
  email: string;
  timestamp: Date;
  success: boolean;
  userAgent: string;
}
```

### Security Events Logged

- ✅ Successful logins with IP and user agent
- ❌ Failed login attempts with details
- 🚫 Blocked IPs and reasons
- ⏰ Rate limit violations
- 🔄 Token refresh events

## 🧪 Testing Security Features

### 1. Test Rate Limiting

```bash
# Run the provided test script
./test-security.sh
```

### 2. Manual Testing

#### Rate Limiting Test

```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

#### Brute Force Protection Test

```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"wrongpassword"}'
done
```

#### Security Headers Test

```bash
curl -I http://localhost:3000/
```

## 📊 Performance Impact

- **Memory Usage**: Minimal increase due to cache-based storage
- **Response Time**: ~1-2ms overhead per request for security checks
- **Storage**: In-memory cache for login attempts and blocked IPs
- **Cleanup**: Automatic cache expiration prevents memory leaks

## 🔮 Usage Examples

### Applying Custom Rate Limits

```typescript
@Controller('api')
export class ApiController {
  @Get('data')
  @UseGuards(RateLimitGuard)
  @RateLimit({ type: 'medium' })
  getData() {
    return { data: 'sensitive information' };
  }
}
```

### Skipping IP Checks

```typescript
@Controller('public')
export class PublicController {
  @Get('status')
  @SkipIPCheck()
  getStatus() {
    return { status: 'ok' };
  }
}
```

### Custom Security Logic

```typescript
@Injectable()
export class CustomSecurityService {
  constructor(private securityService: SecurityService) {}

  async checkCustomSecurity(ip: string, userAgent: string) {
    const clientId = this.securityService.generateClientIdentifier(
      ip,
      userAgent,
    );
    const isAllowed = this.securityService.isIPAllowed(ip);

    if (!isAllowed) {
      await this.securityService.blockIP(ip, 'Custom security violation');
    }

    return isAllowed;
  }
}
```

## 🚨 Security Best Practices

1. **Regular Security Audits**: Review and update security configurations monthly
2. **Monitor Logs**: Check security events regularly for suspicious activity
3. **Update Dependencies**: Keep security packages up to date
4. **Environment Separation**: Use different configs for dev/staging/prod
5. **Backup & Recovery**: Secure backup of security configurations
6. **Strong Passwords**: Enforce strong password policies
7. **HTTPS Only**: Always use HTTPS in production
8. **Regular Penetration Testing**: Conduct security assessments

## 🔧 Customization

### Adding New Rate Limit Types

1. Update the `SecurityConfig` interface in `security.interfaces.ts`
2. Add the new type to the `config.throttleSettings` in `SecurityService`
3. Use the new type in controllers with `@RateLimit({ type: 'your_new_type' })`

### Custom Security Rules

Extend the `SecurityService` to add custom security logic:

```typescript
@Injectable()
export class ExtendedSecurityService extends SecurityService {
  async customSecurityCheck(request: Request): Promise<boolean> {
    // Your custom security logic here
    return true;
  }
}
```

## 🎯 Monitoring Dashboard (Future Enhancement)

Consider implementing a security dashboard that displays:

- Real-time attack attempts
- Blocked IPs
- Rate limit violations
- Geographic attack patterns
- Security event timeline

## 📞 Support

For security-related questions or issues:

1. Check the logs for detailed error messages
2. Review the security configuration in `.env`
3. Verify that all security modules are properly imported
4. Test with the provided security test script

---

**🛡️ Security is an ongoing process. Regularly review and update your security measures to protect against evolving threats.**
