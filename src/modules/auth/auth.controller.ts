import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Headers('cf-connecting-ip') cfConnectingIp?: string,
    @Headers('x-forwarded-for') xForwardedFor?: string,
  ) {
    return this.authService.login(dto, {
      ipAddress: this.resolveIpAddress(cfConnectingIp, xForwardedFor),
    });
  }

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    return this.authService.me(authorization);
  }

  private resolveIpAddress(
    cfConnectingIp?: string,
    xForwardedFor?: string,
  ) {
    if (cfConnectingIp?.trim()) return cfConnectingIp.trim();

    const forwarded = xForwardedFor
      ?.split(',')
      .map((value) => value.trim())
      .find(Boolean);

    return forwarded || 'unknown';
  }
}
