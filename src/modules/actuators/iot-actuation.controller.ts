import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActuatorsService } from './actuators.service';
import { AckActuationDto } from './dto/ack-actuation.dto';

@Controller('iot/actuators')
export class IotActuationController {
  private readonly logger = new Logger(IotActuationController.name);

  constructor(
    private readonly actuatorsService: ActuatorsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async listByDevice(
    @Headers('x-device-key') deviceKey: string | undefined,
    @Query('deviceId') deviceId?: string,
  ) {
    const expectedKey = this.configService.get<string>('DEVICE_API_KEY');

    if (!expectedKey || !deviceKey || deviceKey !== expectedKey) {
      this.logger.warn(
        `Unauthorized actuation polling for deviceId=${deviceId ?? 'missing'}`,
      );
      throw new UnauthorizedException('Invalid device key');
    }

    if (!deviceId) {
      return [];
    }

    return this.actuatorsService.listForRuntime(deviceId);
  }

  @Post(':id/ack')
  async acknowledgeCommand(
    @Param('id') actuatorId: string,
    @Headers('x-device-key') deviceKey: string | undefined,
    @Body() body: AckActuationDto,
  ) {
    const expectedKey = this.configService.get<string>('DEVICE_API_KEY');

    if (!expectedKey || !deviceKey || deviceKey !== expectedKey) {
      this.logger.warn(
        `Unauthorized actuation ack for actuatorId=${actuatorId}`,
      );
      throw new UnauthorizedException('Invalid device key');
    }

    return this.actuatorsService.acknowledgeRuntimeState(actuatorId, body);
  }
}
