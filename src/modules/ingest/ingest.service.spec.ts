import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { IngestService } from './ingest.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../infra/cache/cache.service';
import { AlertDeliveryQueueService } from '../../infra/alerts/alert-delivery-queue.service';
import { ConnectivityAlertPolicyService } from '../../infra/alerts/connectivity-alert-policy.service';

describe('IngestService', () => {
  let service: IngestService;
  let fakePrisma: any;
  let fakeConfigService: any;
  let fakeCache: any;
  let fakeAlertQueue: any;
  let fakeConnectivityAlertPolicy: any;

  beforeEach(async () => {
    fakePrisma = {
      sensorReading: { create: jest.fn().mockResolvedValue(undefined) },
      temperatureLog: { create: jest.fn().mockResolvedValue(undefined) },
      device: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
    };

    fakeConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'DEVICE_RATE_LIMIT_WINDOW_SECONDS') return 60;
        if (key === 'DEVICE_RATE_LIMIT_MAX_REQUESTS') return 2;
        return undefined;
      }),
    };
    fakeCache = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
      invalidate: jest.fn(),
      invalidatePrefix: jest.fn(),
    };
    fakeAlertQueue = {
      enqueue: jest.fn(),
    };
    fakeConnectivityAlertPolicy = {
      handleRecoveryTransition: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: PrismaService, useValue: fakePrisma },
        { provide: ConfigService, useValue: fakeConfigService },
        { provide: CacheService, useValue: fakeCache },
        { provide: AlertDeliveryQueueService, useValue: fakeAlertQueue },
        {
          provide: ConnectivityAlertPolicyService,
          useValue: fakeConnectivityAlertPolicy,
        },
      ],
    }).compile();

    service = module.get<IngestService>(IngestService);
  });

  it('should return 429 when device exceeds limit in window', async () => {
    const body = { device_id: 'freezer_01', temperature: -12.3 };

    await service.ingestTemperature(body);
    await service.ingestTemperature(body);

    try {
      await service.ingestTemperature(body);
      fail('Expected rate limit exception');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(429);
    }
  });

  it('should persist generic reading without writing temperatureLog for non-temperature sensors', async () => {
    await service.ingestReading({
      device_id: 'freezer_01',
      sensor_type: 'umidade',
      value: 61.2,
    });

    expect(fakePrisma.sensorReading.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          deviceId: 'freezer_01',
          sensorType: 'umidade',
          value: 61.2,
        }),
      }),
    );
    expect(fakePrisma.temperatureLog.create).not.toHaveBeenCalled();
  });

  it('should enqueue back online alert when device recovers from offline state', async () => {
    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'freezer_01',
      clientId: 'client_a',
      isOffline: true,
      lastSeen: new Date('2026-03-17T18:00:00.000Z'),
      offlineSince: new Date('2026-03-17T18:05:00.000Z'),
    });
    fakeConnectivityAlertPolicy.handleRecoveryTransition.mockReturnValue({
      type: 'device_back_online',
      clientId: 'client_a',
      deviceId: 'freezer_01',
      lastSeenAt: '2026-03-17T18:00:00.000Z',
      offlineSince: '2026-03-17T18:05:00.000Z',
      cameOnlineAt: '2026-03-17T18:10:00.000Z',
    });

    await service.ingestTemperature({
      device_id: 'freezer_01',
      temperature: -12.3,
      client_id: 'client_a',
    });

    expect(fakeAlertQueue.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'device_back_online',
        clientId: 'client_a',
        deviceId: 'freezer_01',
        offlineSince: '2026-03-17T18:05:00.000Z',
      }),
    );
  });

  it('should enqueue instability alert instead of simple recovery when flapping repeats', async () => {
    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'freezer_01',
      clientId: 'client_a',
      isOffline: true,
      lastSeen: new Date('2026-03-17T18:00:00.000Z'),
      offlineSince: new Date('2026-03-17T18:05:00.000Z'),
    });
    fakeConnectivityAlertPolicy.handleRecoveryTransition.mockReturnValue({
      type: 'device_connectivity_instability',
      clientId: 'client_a',
      deviceId: 'freezer_01',
      offlineSince: '2026-03-17T18:05:00.000Z',
      cameOnlineAt: '2026-03-17T18:10:00.000Z',
      flapCount: 3,
      windowMinutes: 30,
    });

    await service.ingestTemperature({
      device_id: 'freezer_01',
      temperature: -12.3,
      client_id: 'client_a',
    });

    expect(fakeAlertQueue.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'device_connectivity_instability',
        clientId: 'client_a',
        deviceId: 'freezer_01',
        flapCount: 3,
        windowMinutes: 30,
      }),
    );
  });

  it('does not enqueue connectivity alert when policy suppresses noisy recovery', async () => {
    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'freezer_01',
      clientId: 'client_a',
      isOffline: true,
      lastSeen: new Date('2026-03-17T18:00:00.000Z'),
      offlineSince: new Date('2026-03-17T18:05:00.000Z'),
    });
    fakeConnectivityAlertPolicy.handleRecoveryTransition.mockReturnValue(null);

    await service.ingestTemperature({
      device_id: 'freezer_01',
      temperature: -12.3,
      client_id: 'client_a',
    });

    expect(fakeAlertQueue.enqueue).not.toHaveBeenCalled();
  });
});
