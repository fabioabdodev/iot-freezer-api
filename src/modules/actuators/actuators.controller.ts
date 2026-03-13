import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ActuatorsService } from './actuators.service';
import { CreateActuatorDto } from './dto/create-actuator.dto';
import { UpdateActuatorDto } from './dto/update-actuator.dto';
import { CreateActuationCommandDto } from './dto/create-actuation-command.dto';

@Controller('actuators')
export class ActuatorsController {
  constructor(private readonly actuatorsService: ActuatorsService) {}

  @Post()
  async create(@Body() dto: CreateActuatorDto) {
    return this.actuatorsService.create(dto);
  }

  @Get()
  async list(
    @Query('clientId') clientId?: string,
    @Query('deviceId') deviceId?: string,
    @Query('state') state?: string,
  ) {
    return this.actuatorsService.list({ clientId, deviceId, state });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('clientId') clientId?: string) {
    return this.actuatorsService.findOne(id, clientId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateActuatorDto) {
    return this.actuatorsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.actuatorsService.remove(id);
  }

  @Get(':id/commands')
  async listCommands(@Param('id') id: string, @Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.actuatorsService.listCommands(id, parsedLimit);
  }

  @Post(':id/commands')
  async createCommand(
    @Param('id') id: string,
    @Body() dto: CreateActuationCommandDto,
  ) {
    return this.actuatorsService.createCommand(id, dto);
  }
}
