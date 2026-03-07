import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get(':deviceId')
  async listByDevice(
    @Param('deviceId') deviceId: string,
    @Query('clientId') clientId?: string,
    @Query('sensor') sensor?: string,
    @Query('limit') limit?: string,
    @Query('resolution') resolution?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.readingsService.listByDevice(
      deviceId,
      clientId,
      sensor ?? 'temperature',
      parsedLimit,
      resolution,
    );
  }
}
