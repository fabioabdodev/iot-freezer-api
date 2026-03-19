import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { IngestController } from '../src/modules/ingest/ingest.controller';
import { IngestService } from '../src/modules/ingest/ingest.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CacheService } from '../src/infra/cache/cache.service';
import { RuntimeDeviceKeyService } from '../src/infra/runtime-auth/runtime-device-key.service';
import { AlertDeliveryQueueService } from '../src/infra/alerts/alert-delivery-queue.service';
import { ConnectivityAlertPolicyService } from '../src/infra/alerts/connectivity-alert-policy.service';

describe('Ingest Rate Limit (e2e)', () => {
  let app: INestApplication;
  let fakePrisma: {
    sensorReading: { create: jest.Mock };
    temperatureLog: { create: jest.Mock };
    device: { upsert: jest.Mock; findUnique: jest.Mock };
  };

  beforeEach(async () => {
    fakePrisma = {
      sensorReading: { create: jest.fn().mockResolvedValue(undefined) },
      temperatureLog: { create: jest.fn().mockResolvedValue(undefined) },
      device: {
        upsert: jest.fn().mockResolvedValue(undefined),
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        IngestService,
        { provide: PrismaService, useValue: fakePrisma },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'DEVICE_API_KEY') return 'expected-key';
              if (key === 'DEVICE_RATE_LIMIT_WINDOW_SECONDS') return 60;
              if (key === 'DEVICE_RATE_LIMIT_MAX_REQUESTS') return 2;
              return undefined;
            }),
          },
        },
        {
          provide: CacheService,
          useValue: { invalidatePrefix: jest.fn() },
        },
        {
          provide: AlertDeliveryQueueService,
          useValue: { enqueue: jest.fn() },
        },
        {
          provide: ConnectivityAlertPolicyService,
          useValue: { handleRecoveryTransition: jest.fn().mockReturnValue(null) },
        },
        {
          provide: RuntimeDeviceKeyService,
          useValue: {
            isValidForIngest: jest.fn((deviceKey: string | undefined) =>
              Promise.resolve(deviceKey === 'expected-key'),
            ),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  it('POST /iot/temperature should return 429 when requests exceed limit for same device', async () => {
    const payload = { device_id: 'freezer_01', temperature: -12.3 };

    await request(app.getHttpServer())
      .post('/iot/temperature')
      .set('x-device-key', 'expected-key')
      .send(payload)
      .expect(200);

    await request(app.getHttpServer())
      .post('/iot/temperature')
      .set('x-device-key', 'expected-key')
      .send(payload)
      .expect(200);

    await request(app.getHttpServer())
      .post('/iot/temperature')
      .set('x-device-key', 'expected-key')
      .send(payload)
      .expect(429);
  });
});
