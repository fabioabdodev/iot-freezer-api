import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache/cache.service';
import { AlertDeliveryQueueService } from './alerts/alert-delivery-queue.service';

@Global()
@Module({
  providers: [CacheService, AlertDeliveryQueueService],
  exports: [CacheService, AlertDeliveryQueueService],
})
export class InfraModule {}

