import { Body, Controller, Post } from '@nestjs/common';
import { TemperatureDto } from './dto/temperature.dto';

@Controller('iot')
export class IotController {

  @Post('temperature')
  receiveTemperature(@Body() body: TemperatureDto) {

    console.log("Device:", body.device_id);
    console.log("Temperatura:", body.temperature);

    return { ok: true };

  }

}
