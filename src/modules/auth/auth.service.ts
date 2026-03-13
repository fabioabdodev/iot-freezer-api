import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SessionUser } from './auth.types';

type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
  clientId: string | null;
  exp: number;
};

type LoginContext = {
  ipAddress?: string;
};

type LoginAttemptState = {
  attempts: number[];
  blockedUntil: number | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly loginAttempts = new Map<string, LoginAttemptState>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, context: LoginContext = {}) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const loginKey = this.buildLoginKey(normalizedEmail, context.ipAddress);

    this.assertLoginAllowed(loginKey);
    await this.validateTurnstile(dto.turnstileToken, context.ipAddress);

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    } as any);

    if (
      !user ||
      !(user as any).isActive ||
      !this.verifyPassword(dto.password, (user as any).passwordHash)
    ) {
      this.registerFailedAttempt(loginKey, normalizedEmail, context.ipAddress);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.clearLoginAttempts(loginKey);

    await this.prisma.user.update({
      where: { id: (user as any).id },
      data: { lastLoginAt: new Date() },
    } as any);

    const token = this.signToken({
      sub: (user as any).id,
      email: (user as any).email,
      role: (user as any).role,
      clientId: (user as any).clientId ?? null,
      exp: this.buildExpiryTimestamp(),
    });

    return {
      token,
      user: this.sanitizeUser({
        ...(user as any),
        lastLoginAt: new Date(),
      }),
    };
  }

  async me(authorization?: string) {
    return this.authenticateFromAuthorization(authorization);
  }

  hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      clientId: user.clientId ?? null,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone ?? null,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } satisfies SessionUser;
  }

  async authenticateFromAuthorization(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorization.slice('Bearer '.length).trim();
    const payload = this.verifyToken(token);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    } as any);

    if (!user || !(user as any).isActive) {
      throw new UnauthorizedException('Session user not found');
    }

    return this.sanitizeUser(user);
  }

  private signToken(payload: AuthTokenPayload) {
    const encodedPayload = this.toBase64Url(JSON.stringify(payload));
    const signature = this.createSignature(encodedPayload);
    return `${encodedPayload}.${signature}`;
  }

  private verifyToken(token: string): AuthTokenPayload {
    const [encodedPayload, providedSignature] = token.split('.');
    if (!encodedPayload || !providedSignature) {
      throw new UnauthorizedException('Invalid token format');
    }

    const expectedSignature = this.createSignature(encodedPayload);
    if (
      Buffer.byteLength(providedSignature) !== Buffer.byteLength(expectedSignature) ||
      !timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))
    ) {
      throw new UnauthorizedException('Invalid token signature');
    }

    let payload: AuthTokenPayload;
    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as AuthTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (!payload?.sub || !payload?.email || !payload?.exp) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.exp <= Date.now()) {
      throw new UnauthorizedException('Token expired');
    }

    return payload;
  }

  private verifyPassword(password: string, passwordHash: string) {
    const [salt, storedHash] = passwordHash.split(':');
    if (!salt || !storedHash) return false;

    const computedHash = scryptSync(password, salt, 64).toString('hex');
    if (Buffer.byteLength(computedHash) !== Buffer.byteLength(storedHash)) {
      return false;
    }

    return timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedHash));
  }

  private createSignature(value: string) {
    return createHmac('sha256', this.getAuthSecret())
      .update(value)
      .digest('base64url');
  }

  private toBase64Url(value: string) {
    return Buffer.from(value, 'utf8').toString('base64url');
  }

  private buildExpiryTimestamp() {
    const ttlHours = this.configService.get<number>('AUTH_TOKEN_TTL_HOURS') ?? 168;
    return Date.now() + ttlHours * 60 * 60 * 1000;
  }

  private assertLoginAllowed(loginKey: string) {
    const state = this.loginAttempts.get(loginKey);
    if (!state?.blockedUntil) return;
    if (state.blockedUntil <= Date.now()) {
      this.loginAttempts.delete(loginKey);
      return;
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((state.blockedUntil - Date.now()) / 1000),
    );
    throw new HttpException(
      `Too many login attempts. Try again in ${retryAfterSeconds} seconds.`,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  private registerFailedAttempt(
    loginKey: string,
    email: string,
    ipAddress?: string,
  ) {
    const windowSeconds =
      this.configService.get<number>('AUTH_LOGIN_RATE_LIMIT_WINDOW_SECONDS') ?? 300;
    const maxAttempts =
      this.configService.get<number>('AUTH_LOGIN_RATE_LIMIT_MAX_ATTEMPTS') ?? 5;
    const lockMinutes =
      this.configService.get<number>('AUTH_LOGIN_LOCK_MINUTES') ?? 15;
    const maxTrackedKeys =
      this.configService.get<number>('AUTH_LOGIN_RATE_LIMIT_MAX_TRACKED_KEYS') ??
      10000;

    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;
    const current = this.loginAttempts.get(loginKey);
    const attempts = (current?.attempts ?? []).filter((ts) => ts > windowStart);
    attempts.push(now);

    const blockedUntil =
      attempts.length >= maxAttempts ? now + lockMinutes * 60 * 1000 : null;

    this.loginAttempts.set(loginKey, {
      attempts,
      blockedUntil,
    });

    this.compactLoginAttempts(windowStart, maxTrackedKeys);

    if (blockedUntil) {
      this.logger.warn(
        `Login temporarily blocked for email=${email} ip=${ipAddress ?? 'unknown'} after ${attempts.length} attempts`,
      );
    }
  }

  private clearLoginAttempts(loginKey: string) {
    this.loginAttempts.delete(loginKey);
  }

  private compactLoginAttempts(windowStart: number, maxTrackedKeys: number) {
    for (const [key, state] of this.loginAttempts.entries()) {
      if (state.blockedUntil && state.blockedUntil > Date.now()) {
        continue;
      }

      const attempts = state.attempts.filter((ts) => ts > windowStart);
      if (attempts.length === 0) {
        this.loginAttempts.delete(key);
      } else {
        this.loginAttempts.set(key, {
          attempts,
          blockedUntil: null,
        });
      }
    }

    while (this.loginAttempts.size > maxTrackedKeys) {
      const oldestKey = this.loginAttempts.keys().next().value as
        | string
        | undefined;
      if (!oldestKey) break;
      this.loginAttempts.delete(oldestKey);
    }
  }

  private buildLoginKey(email: string, ipAddress?: string) {
    return `${email}|${ipAddress?.trim() || 'unknown'}`;
  }

  private async validateTurnstile(
    turnstileToken?: string,
    ipAddress?: string,
  ) {
    const secret = this.configService.get<string>('TURNSTILE_SECRET_KEY');
    if (!secret) return;

    if (!turnstileToken?.trim()) {
      throw new BadRequestException('Cloudflare Turnstile token is required');
    }

    const verifyUrl =
      this.configService.get<string>('TURNSTILE_VERIFY_URL') ??
      'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    const payload = new URLSearchParams({
      secret,
      response: turnstileToken.trim(),
    });

    if (ipAddress?.trim() && ipAddress !== 'unknown') {
      payload.set('remoteip', ipAddress.trim());
    }

    try {
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        this.logger.warn(
          `Turnstile verification HTTP failure status=${response.status}`,
        );
        throw new BadRequestException('Cloudflare Turnstile verification failed');
      }

      const data = (await response.json()) as {
        success?: boolean;
        ['error-codes']?: string[];
      };

      if (!data.success) {
        const code = data['error-codes']?.join(', ') || 'unknown';
        this.logger.warn(`Turnstile rejected login attempt errorCodes=${code}`);
        throw new BadRequestException('Cloudflare Turnstile validation failed');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.warn(
        `Turnstile verification unavailable: ${(error as Error).message}`,
      );
      throw new BadRequestException('Cloudflare Turnstile verification failed');
    }
  }

  private getAuthSecret() {
    return this.configService.get<string>('AUTH_SECRET') ?? 'change-me-immediately';
  }
}
