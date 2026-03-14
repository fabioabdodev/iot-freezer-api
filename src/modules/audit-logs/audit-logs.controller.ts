import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CurrentUser, RequireRole } from '../auth/auth.decorators';
import { RoleGuard, SessionAuthGuard } from '../auth/auth.guards';
import { resolveScopedClientId } from '../auth/auth.scope';
import type { SessionUser } from '../auth/auth.types';

@Controller('audit-logs')
@UseGuards(SessionAuthGuard, RoleGuard)
@RequireRole('admin')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async list(
    @Query('clientId') clientId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('limit') limit?: string,
    @CurrentUser() authUser?: SessionUser,
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;

    return this.auditLogsService.list({
      clientId: authUser ? resolveScopedClientId(authUser, clientId) : clientId,
      entityType,
      entityId,
      limit: parsedLimit,
    });
  }
}
