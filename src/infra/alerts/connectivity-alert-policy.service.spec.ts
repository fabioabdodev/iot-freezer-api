import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConnectivityAlertPolicyService } from './connectivity-alert-policy.service';
import { CacheService } from '../cache/cache.service';

describe('ConnectivityAlertPolicyService', () => {
  let service: ConnectivityAlertPolicyService;
  let cache: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectivityAlertPolicyService,
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CONNECTIVITY_FLAP_WINDOW_MINUTES') return 30;
              if (key === 'CONNECTIVITY_FLAP_THRESHOLD') return 3;
              if (key === 'CONNECTIVITY_INSTABILITY_ALERT_COOLDOWN_MINUTES')
                return 60;
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ConnectivityAlertPolicyService>(
      ConnectivityAlertPolicyService,
    );
    cache = module.get<CacheService>(CacheService);
  });

  it('returns regular offline alert on first transition', () => {
    const result = service.handleOfflineTransition({
      clientId: 'client_a',
      deviceId: 'dev1',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:06:00.000Z',
    });

    expect(result).toEqual({
      type: 'device_offline',
      clientId: 'client_a',
      deviceId: 'dev1',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:06:00.000Z',
    });
  });

  it('returns instability alert when transition threshold is reached', () => {
    cache.set('connectivity:transitions:dev1', { count: 2, firstAt: Date.now() }, 1800);

    const result = service.handleOfflineTransition({
      clientId: 'client_a',
      deviceId: 'dev1',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:06:00.000Z',
    });

    expect(result).toEqual({
      type: 'device_connectivity_instability',
      clientId: 'client_a',
      deviceId: 'dev1',
      offlineSince: '2026-03-17T18:06:00.000Z',
      cameOnlineAt: '2026-03-17T18:00:00.000Z',
      flapCount: 3,
      windowMinutes: 30,
    });
  });

  it('suppresses recovery alert while instability cooldown is active', () => {
    cache.set('connectivity:instability-alert:dev1', true, 3600);

    const result = service.handleRecoveryTransition({
      clientId: 'client_a',
      deviceId: 'dev1',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:06:00.000Z',
      cameOnlineAt: '2026-03-17T18:08:00.000Z',
    });

    expect(result).toBeNull();
  });

  it('returns regular recovery alert before flapping threshold is reached', () => {
    cache.set('connectivity:transitions:dev1', { count: 1, firstAt: Date.now() }, 1800);

    const result = service.handleRecoveryTransition({
      clientId: 'client_a',
      deviceId: 'dev1',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:06:00.000Z',
      cameOnlineAt: '2026-03-17T18:08:00.000Z',
    });

    expect(result).toEqual({
      type: 'device_back_online',
      clientId: 'client_a',
      deviceId: 'dev1',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:06:00.000Z',
      cameOnlineAt: '2026-03-17T18:08:00.000Z',
    });
  });
});
