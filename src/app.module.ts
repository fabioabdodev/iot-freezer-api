import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IotModule } from './iot/iot.module';

@Module({
  imports: [IotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
