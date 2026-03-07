import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { IngestService } from './ingest.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('IngestService', () => {
  let service: IngestService;
  let fakePrisma: any;
  let fakeConfigService: any;

  beforeEach(async () => {
    fakePrisma = {
      temperatureLog: { create: jest.fn().mockResolvedValue(undefined) },
      device: { upsert: jest.fn().mockResolvedValue(undefined) },
    };

    fakeConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'DEVICE_RATE_LIMIT_WINDOW_SECONDS') return 60;
        if (key === 'DEVICE_RATE_LIMIT_MAX_REQUESTS') return 2;
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: PrismaService, useValue: fakePrisma },
        { provide: ConfigService, useValue: fakeConfigService },
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
});
