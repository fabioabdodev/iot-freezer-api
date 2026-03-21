import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EnergyService } from './energy.service';
import { CurrentUser, RequireModule } from '../auth/auth.decorators';
import { ModuleAccessGuard, SessionAuthGuard } from '../auth/auth.guards';
import { resolveScopedClientId } from '../auth/auth.scope';
import type { SessionUser } from '../auth/auth.types';

@Controller('energy')
@UseGuards(SessionAuthGuard, ModuleAccessGuard)
@RequireModule('energia')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('readings/:deviceId')
  async listDeviceReadings(
    @Param('deviceId') deviceId: string,
    @Query('clientId') clientId?: string,
    @Query('sensor') sensor?: string,
    @Query('limit') limit?: string,
    @Query('resolution') resolution?: string,
    @CurrentUser() authUser?: SessionUser,
  ) {
    return this.energyService.listDeviceReadings({
      deviceId,
      clientId: authUser ? resolveScopedClientId(authUser, clientId) : clientId,
      sensor,
      limit: limit ? Number(limit) : undefined,
      resolution,
    });
  }

  @Get('summary')
  async getClientSummary(
    @Query('clientId') clientId?: string,
    @Query('sensors') sensors?: string,
    @Query('recentHours') recentHours?: string,
    @CurrentUser() authUser?: SessionUser,
  ) {
    const scopedClientId = authUser
      ? resolveScopedClientId(authUser, clientId)
      : clientId;

    return this.energyService.getClientSummary({
      clientId: scopedClientId ?? '',
      sensors: sensors
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      recentWindowHours: recentHours ? Number(recentHours) : undefined,
    });
  }
}
