import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../../prisma/prisma.module';
import { JadeCommercialService } from './jade-commercial.service';
import { JadeCommercialController } from './jade-commercial.controller';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [JadeCommercialController],
  providers: [JadeCommercialService],
  exports: [JadeCommercialService],
})
export class JadeCommercialModule {}
