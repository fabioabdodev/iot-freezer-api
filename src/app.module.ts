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
import { AlertRulesModule } from './modules/alert-rules/alert-rules.module';
import { validateEnv } from './config/env';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    InfraModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    IngestModule,
    MonitorModule,
    DevicesModule,
    ReadingsModule,
    ClientsModule,
    AlertRulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
