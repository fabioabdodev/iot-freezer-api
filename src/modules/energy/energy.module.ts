import { Module } from '@nestjs/common';
import { EnergyController } from './energy.controller';
import { EnergyService } from './energy.service';
import { AuthModule } from '../auth/auth.module';
import { ReadingsModule } from '../readings/readings.module';

@Module({
  imports: [AuthModule, ReadingsModule],
  controllers: [EnergyController],
  providers: [EnergyService],
})
export class EnergyModule {}
