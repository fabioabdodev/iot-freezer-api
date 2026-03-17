import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { IngestService } from './ingest.service';
import { TemperatureDto } from './dto/temperature.dto';
import { RuntimeDeviceKeyService } from '../../infra/runtime-auth/runtime-device-key.service';

@Controller('iot') // mantém a URL antiga: /iot/temperature
export class IngestController {
  private readonly logger = new Logger(IngestController.name);

  constructor(
    private readonly ingest: IngestService,
    private readonly runtimeDeviceKeyService: RuntimeDeviceKeyService,
  ) {}

  @Post('temperature')
  @HttpCode(200)
  async temperature(
    @Headers('x-device-key') deviceKey: string | undefined,
    @Body() body: TemperatureDto,
  ) {
    const isValidKey = await this.runtimeDeviceKeyService.isValidForIngest(
      deviceKey,
      {
        deviceId: body.device_id,
        clientId: body.client_id,
      },
    );

    if (!isValidKey) {
      this.logger.warn(
        `Unauthorized ingest attempt for device_id=${body.device_id}`,
      );
      throw new UnauthorizedException('Invalid device key');
    }

    this.logger.log(
      `Accepted ingest for device_id=${body.device_id} temperature=${body.temperature}`,
    );
    await this.ingest.ingestTemperature(body);
    return { ok: true };
  }
}
