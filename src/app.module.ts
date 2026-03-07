import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IngestModule } from './modules/ingest/ingest.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { DevicesModule } from './modules/devices/devices.module';
import { ReadingsModule } from './modules/readings/readings.module';
import { ClientsModule } from './modules/clients/clients.module';
import { validateEnv } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    IngestModule,
    MonitorModule,
    DevicesModule,
    ReadingsModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
