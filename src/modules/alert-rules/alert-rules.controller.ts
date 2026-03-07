import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AlertRulesService } from './alert-rules.service';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';
import { UpdateAlertRuleDto } from './dto/update-alert-rule.dto';

@Controller('alert-rules')
export class AlertRulesController {
  constructor(private readonly alertRulesService: AlertRulesService) {}

  @Post()
  async create(@Body() dto: CreateAlertRuleDto) {
    return this.alertRulesService.create(dto);
  }

  @Get()
  async list(
    @Query('clientId') clientId?: string,
    @Query('deviceId') deviceId?: string,
    @Query('sensorType') sensorType?: string,
    @Query('enabled') enabled?: string,
  ) {
    return this.alertRulesService.list({
      clientId,
      deviceId,
      sensorType,
      enabled: enabled == null ? undefined : enabled === 'true',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.alertRulesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAlertRuleDto) {
    return this.alertRulesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.alertRulesService.remove(id);
  }
}

