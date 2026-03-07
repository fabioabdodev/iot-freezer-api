import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private service: DevicesService) {}

  @Post()
  async createDevice(@Body() dto: CreateDeviceDto) {
    return this.service.create(dto);
  }

  @Get()
  async listDevices(@Query('clientId') clientId?: string) {
    return this.service.listForDashboard(clientId);
  }

  @Get(':id')
  async getDevice(@Param('id') id: string, @Query('clientId') clientId?: string) {
    return this.service.findOne(id, clientId);
  }

  @Get(':id/readings')
  async getDeviceReadings(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('clientId') clientId?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.service.getTemperatureHistory(id, parsedLimit, clientId);
  }

  // patch is used to change configuration such as temperature limits
  @Patch(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
    @Query('clientId') clientId?: string,
  ) {
    return this.service.update(id, dto, clientId);
  }

  @Delete(':id')
  async deleteDevice(@Param('id') id: string, @Query('clientId') clientId?: string) {
    return this.service.remove(id, clientId);
  }
}
