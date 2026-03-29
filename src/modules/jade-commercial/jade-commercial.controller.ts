import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JadeCommercialService } from './jade-commercial.service';
import { UpsertSalesLeadDto } from './dto/upsert-sales-lead.dto';
import { ScheduleCommercialFollowUpDto } from './dto/schedule-commercial-follow-up.dto';
import { CreateHumanHandoffDto } from './dto/create-human-handoff.dto';

@Controller('jade-commercial')
export class JadeCommercialController {
  constructor(
    private readonly jadeCommercialService: JadeCommercialService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sales-leads')
  async upsertSalesLead(
    @Body() dto: UpsertSalesLeadDto,
    @Headers('x-api-key') apiKey?: string,
    @Headers('apikey') legacyApiKey?: string,
  ) {
    this.assertGatewayKey(apiKey ?? legacyApiKey);
    return this.jadeCommercialService.upsertSalesLead(dto);
  }

  @Post('follow-ups')
  async scheduleCommercialFollowUp(
    @Body() dto: ScheduleCommercialFollowUpDto,
    @Headers('x-api-key') apiKey?: string,
    @Headers('apikey') legacyApiKey?: string,
  ) {
    this.assertGatewayKey(apiKey ?? legacyApiKey);
    return this.jadeCommercialService.scheduleCommercialFollowUp({
      ...dto,
      nextContactAt: dto.nextContactAt ? new Date(dto.nextContactAt) : undefined,
    });
  }

  @Post('handoffs')
  async createHumanHandoff(
    @Body() dto: CreateHumanHandoffDto,
    @Headers('x-api-key') apiKey?: string,
    @Headers('apikey') legacyApiKey?: string,
  ) {
    this.assertGatewayKey(apiKey ?? legacyApiKey);
    return this.jadeCommercialService.createHumanHandoff(dto);
  }

  @Get('cross-sell/:clientId')
  async getCrossSellOpportunity(
    @Param('clientId') clientId: string,
    @Headers('x-api-key') apiKey?: string,
    @Headers('apikey') legacyApiKey?: string,
  ) {
    this.assertGatewayKey(apiKey ?? legacyApiKey);
    return this.jadeCommercialService.getClientCrossSellOpportunity(clientId);
  }

  private assertGatewayKey(receivedKey?: string) {
    const configuredKey =
      this.configService.get<string>('JADE_COMMERCIAL_GATEWAY_KEY') ??
      this.configService.get<string>('JADE_DOCS_GATEWAY_KEY') ??
      process.env.JADE_COMMERCIAL_GATEWAY_KEY ??
      process.env.JADE_DOCS_GATEWAY_KEY;

    if (!configuredKey) {
      throw new UnauthorizedException(
        'JADE_COMMERCIAL_GATEWAY_KEY nao configurada.',
      );
    }

    if ((receivedKey ?? '').trim() !== configuredKey.trim()) {
      throw new UnauthorizedException('Chave de gateway da Jade invalida.');
    }
  }
}
