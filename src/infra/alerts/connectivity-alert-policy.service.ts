import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';

type OfflineTransitionInput = {
  clientId: string | null;
  deviceId: string;
  lastSeenAt: string | null;
  offlineSince: string;
};

type RecoveryTransitionInput = {
  clientId: string | null;
  deviceId: string;
  lastSeenAt: string | null;
  offlineSince: string | null;
  cameOnlineAt: string;
};

type ConnectivityPolicyResult =
  | {
      type: 'device_offline';
      clientId: string | null;
      deviceId: string;
      lastSeenAt: string | null;
      offlineSince: string;
    }
  | {
      type: 'device_back_online';
      clientId: string | null;
      deviceId: string;
      lastSeenAt: string | null;
      offlineSince: string | null;
      cameOnlineAt: string;
    }
  | {
      type: 'device_connectivity_instability';
      clientId: string | null;
      deviceId: string;
      offlineSince: string | null;
      cameOnlineAt: string;
      flapCount: number;
      windowMinutes: number;
    }
  | null;

@Injectable()
export class ConnectivityAlertPolicyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cache: CacheService,
  ) {}

  handleOfflineTransition(
    input: OfflineTransitionInput,
  ): ConnectivityPolicyResult {
    const policy = this.evaluateTransition(input.deviceId);

    if (policy.shouldSendInstabilityAlert) {
      return {
        type: 'device_connectivity_instability',
        clientId: input.clientId,
        deviceId: input.deviceId,
        offlineSince: input.offlineSince,
        cameOnlineAt: input.lastSeenAt ?? input.offlineSince,
        flapCount: policy.transitionCount,
        windowMinutes: policy.windowMinutes,
      };
    }

    if (policy.shouldSuppressConnectivityAlerts) {
      return null;
    }

    return {
      type: 'device_offline',
      clientId: input.clientId,
      deviceId: input.deviceId,
      lastSeenAt: input.lastSeenAt,
      offlineSince: input.offlineSince,
    };
  }

  handleRecoveryTransition(
    input: RecoveryTransitionInput,
  ): ConnectivityPolicyResult {
    const policy = this.evaluateTransition(input.deviceId);

    if (policy.shouldSendInstabilityAlert) {
      return {
        type: 'device_connectivity_instability',
        clientId: input.clientId,
        deviceId: input.deviceId,
        offlineSince: input.offlineSince,
        cameOnlineAt: input.cameOnlineAt,
        flapCount: policy.transitionCount,
        windowMinutes: policy.windowMinutes,
      };
    }

    if (policy.shouldSuppressConnectivityAlerts) {
      return null;
    }

    return {
      type: 'device_back_online',
      clientId: input.clientId,
      deviceId: input.deviceId,
      lastSeenAt: input.lastSeenAt,
      offlineSince: input.offlineSince,
      cameOnlineAt: input.cameOnlineAt,
    };
  }

  private evaluateTransition(deviceId: string) {
    const windowMinutes =
      this.configService.get<number>('CONNECTIVITY_FLAP_WINDOW_MINUTES') ?? 30;
    const transitionThreshold =
      this.configService.get<number>('CONNECTIVITY_FLAP_THRESHOLD') ?? 3;
    const instabilityCooldownMinutes =
      this.configService.get<number>(
        'CONNECTIVITY_INSTABILITY_ALERT_COOLDOWN_MINUTES',
      ) ?? 60;

    const transitionState = this.registerConnectivityTransition(
      deviceId,
      windowMinutes,
    );
    const instabilityRecentlySent = this.wasInstabilityAlertRecentlySent(
      deviceId,
    );
    const shouldSendInstabilityAlert =
      transitionState.count >= transitionThreshold && !instabilityRecentlySent;

    if (shouldSendInstabilityAlert) {
      this.markInstabilityAlertAsSent(deviceId, instabilityCooldownMinutes);
    }

    return {
      windowMinutes,
      transitionCount: transitionState.count,
      shouldSendInstabilityAlert,
      shouldSuppressConnectivityAlerts:
        instabilityRecentlySent || shouldSendInstabilityAlert,
    };
  }

  private registerConnectivityTransition(deviceId: string, windowMinutes: number) {
    const key = `connectivity:transitions:${deviceId}`;
    const now = Date.now();
    const current = this.cache.get<{ count: number; firstAt: number }>(key);
    const windowMs = windowMinutes * 60 * 1000;

    if (!current || now - current.firstAt > windowMs) {
      const next = { count: 1, firstAt: now };
      this.cache.set(key, next, windowMinutes * 60);
      return next;
    }

    const next = { count: current.count + 1, firstAt: current.firstAt };
    this.cache.set(key, next, windowMinutes * 60);
    return next;
  }

  private wasInstabilityAlertRecentlySent(deviceId: string) {
    const key = `connectivity:instability-alert:${deviceId}`;
    return this.cache.get<boolean>(key) === true;
  }

  private markInstabilityAlertAsSent(
    deviceId: string,
    cooldownMinutes: number,
  ) {
    const key = `connectivity:instability-alert:${deviceId}`;
    this.cache.set(key, true, cooldownMinutes * 60);
  }
}
