export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  allowedIPs: string[];
  blockedIPs: string[];
  requireStrongPasswords: boolean;
  sessionTimeout: number; // in minutes
  throttleSettings: {
    short: { ttl: number; limit: number }; // 1 minute
    medium: { ttl: number; limit: number }; // 5 minutes
    login: { ttl: number; limit: number }; // login specific
    refresh: { ttl: number; limit: number }; // refresh token specific
  };
}

export interface LoginAttempt {
  ip: string;
  email: string;
  timestamp: Date;
  success: boolean;
  userAgent: string;
}

export interface SecurityEvent {
  type:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'IP_BLOCKED'
    | 'RATE_LIMITED'
    | 'TOKEN_REFRESH';
  ip: string;
  userAgent: string;
  email?: string;
  timestamp: Date;
  details?: any;
}

export interface ClientIdentifier {
  ip: string;
  userAgentHash: string;
}

export interface AccountLockout {
  email: string;
  lockedUntil: Date;
  attempts: number;
}
