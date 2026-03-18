import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache/cache.service';
import { AlertDeliveryQueueService } from './alerts/alert-delivery-queue.service';
import { AuditTrailService } from './audit/audit-trail.service';
import { ConnectivityAlertPolicyService } from './alerts/connectivity-alert-policy.service';

@Global()
@Module({
  providers: [
    CacheService,
    AlertDeliveryQueueService,
    AuditTrailService,
    ConnectivityAlertPolicyService,
  ],
  exports: [
    CacheService,
    AlertDeliveryQueueService,
    AuditTrailService,
    ConnectivityAlertPolicyService,
  ],
})
export class InfraModule {}
