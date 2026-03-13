import { Module } from '@nestjs/common';
import { ActuatorsController } from './actuators.controller';
import { ActuatorsService } from './actuators.service';

@Module({
  // Actuators concentra o modulo inicial de acionamento manual e historico basico.
  controllers: [ActuatorsController],
  providers: [ActuatorsService],
})
export class ActuatorsModule {}
