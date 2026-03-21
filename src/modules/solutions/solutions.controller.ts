import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { CurrentUser, RequireRole } from '../auth/auth.decorators';
import { RoleGuard, SessionAuthGuard } from '../auth/auth.guards';
import type { SessionUser } from '../auth/auth.types';
import { resolveScopedClientId } from '../auth/auth.scope';
import { assertPlatformAdmin } from '../auth/auth.permissions';
import { ApplySolutionDto } from './dto/apply-solution.dto';

@Controller('solutions')
@UseGuards(SessionAuthGuard, RoleGuard)
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Get('catalog')
  listCatalog() {
    return this.solutionsService.listCatalog();
  }

  @Get()
  listByClient(
    @Query('clientId') clientId?: string,
    @CurrentUser() authUser?: SessionUser,
  ) {
    return this.solutionsService.listByClient(
      authUser ? resolveScopedClientId(authUser, clientId) ?? '' : clientId ?? '',
    );
  }

  @Post('apply')
  @RequireRole('admin')
  async applySolution(
    @Body() dto: ApplySolutionDto,
    @CurrentUser() authUser: SessionUser,
  ) {
    assertPlatformAdmin(
      authUser,
      'Only platform admin can apply solution recipes',
    );
    dto.clientId = resolveScopedClientId(authUser, dto.clientId) ?? dto.clientId;
    return this.solutionsService.applySolution(dto);
  }
}
