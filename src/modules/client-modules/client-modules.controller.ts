import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClientModulesService } from './client-modules.service';
import { UpsertClientModuleDto } from './dto/upsert-client-module.dto';

@Controller('client-modules')
export class ClientModulesController {
  constructor(private readonly clientModulesService: ClientModulesService) {}

  @Get()
  async list(@Query('clientId') clientId?: string) {
    return this.clientModulesService.list(clientId ?? '');
  }

  @Post()
  async upsert(@Body() dto: UpsertClientModuleDto) {
    return this.clientModulesService.upsert(dto);
  }
}
