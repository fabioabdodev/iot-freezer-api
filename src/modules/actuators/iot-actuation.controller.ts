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
import { ActuatorsService } from './actuators.service';
import { AckActuationDto } from './dto/ack-actuation.dto';
import { RuntimeDeviceKeyService } from '../../infra/runtime-auth/runtime-device-key.service';

@Controller('iot/actuators')
export class IotActuationController {
  private readonly logger = new Logger(IotActuationController.name);

  constructor(
    private readonly actuatorsService: ActuatorsService,
    private readonly runtimeDeviceKeyService: RuntimeDeviceKeyService,
  ) {}

  @Get()
  async listByDevice(
    @Headers('x-device-key') deviceKey: string | undefined,
    @Query('deviceId') deviceId?: string,
  ) {
    if (!deviceId) {
      return [];
    }

    const isValidKey = await this.runtimeDeviceKeyService.isValidForDevice(
      deviceKey,
      deviceId,
    );

    if (!isValidKey) {
      this.logger.warn(
        `Unauthorized actuation polling for deviceId=${deviceId ?? 'missing'}`,
      );
      throw new UnauthorizedException('Invalid device key');
    }

    return this.actuatorsService.listForRuntime(deviceId);
  }

  @Post(':id/ack')
  async acknowledgeCommand(
    @Param('id') actuatorId: string,
    @Headers('x-device-key') deviceKey: string | undefined,
    @Body() body: AckActuationDto,
  ) {
    const isValidKey = await this.runtimeDeviceKeyService.isValidForActuator(
      deviceKey,
      actuatorId,
    );

    if (!isValidKey) {
      this.logger.warn(
        `Unauthorized actuation ack for actuatorId=${actuatorId}`,
      );
      throw new UnauthorizedException('Invalid device key');
    }

    return this.actuatorsService.acknowledgeRuntimeState(actuatorId, body);
  }
}
