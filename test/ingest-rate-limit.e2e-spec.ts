import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { IngestController } from '../src/modules/ingest/ingest.controller';
import { IngestService } from '../src/modules/ingest/ingest.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Ingest Rate Limit (e2e)', () => {
  let app: INestApplication;
  let fakePrisma: {
    temperatureLog: { create: jest.Mock };
    device: { upsert: jest.Mock };
  };

  beforeEach(async () => {
    fakePrisma = {
      temperatureLog: { create: jest.fn().mockResolvedValue(undefined) },
      device: { upsert: jest.fn().mockResolvedValue(undefined) },
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
    await app.close();
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

