import { Module } from '@nestjs/common';
import { SolutionsController } from './solutions.controller';
import { SolutionsService } from './solutions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SolutionsController],
  providers: [SolutionsService],
})
export class SolutionsModule {}
