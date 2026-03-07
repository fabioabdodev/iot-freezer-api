import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ReadingsService } from './readings.service';
import { CacheService } from '../../infra/cache/cache.service';
import { ConfigService } from '@nestjs/config';

describe('ReadingsService', () => {
  let service: ReadingsService;
  let fakePrisma: any;
  let fakeCache: any;
  let fakeConfigService: any;

  beforeEach(async () => {
    fakePrisma = {
      device: { findUnique: jest.fn() },
      temperatureLog: { findMany: jest.fn() },
    };
    fakeCache = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
    };
    fakeConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'CACHE_TTL_SECONDS') return 15;
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingsService,
        { provide: PrismaService, useValue: fakePrisma },
        { provide: CacheService, useValue: fakeCache },
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    service = module.get<ReadingsService>(ReadingsService);
  });

  it('should return normalized temperature readings', async () => {
    const now = new Date();
    fakePrisma.temperatureLog.findMany.mockResolvedValue([
      { deviceId: 'freezer_01', temperature: -10, createdAt: now },
    ]);

    const result = await service.listByDevice(
      'freezer_01',
      undefined,
      'temperature',
      10,
    );

    expect(result).toEqual([
      {
        deviceId: 'freezer_01',
        sensorType: 'temperature',
        value: -10,
        createdAt: now,
      },
    ]);
  });

  it('should return empty array for unsupported sensor type', async () => {
    const result = await service.listByDevice(
      'freezer_01',
      undefined,
      'humidity',
      10,
    );
    expect(result).toEqual([]);
    expect(fakePrisma.temperatureLog.findMany).not.toHaveBeenCalled();
  });

  it('should throw when device does not belong to informed client', async () => {
    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'freezer_01',
      clientId: 'client_a',
    });

    await expect(
      service.listByDevice('freezer_01', 'client_b', 'temperature', 10),
    ).rejects.toMatchObject({ status: 404 });

    expect(fakePrisma.temperatureLog.findMany).not.toHaveBeenCalled();
  });

  it('should aggregate readings when resolution is provided', async () => {
    fakePrisma.temperatureLog.findMany.mockResolvedValue([
      {
        deviceId: 'freezer_01',
        temperature: -10,
        createdAt: new Date('2026-03-07T10:00:00.000Z'),
      },
      {
        deviceId: 'freezer_01',
        temperature: -12,
        createdAt: new Date('2026-03-07T10:04:00.000Z'),
      },
    ]);

    const result = await service.listByDevice(
      'freezer_01',
      undefined,
      'temperature',
      10,
      '5m',
    );

    expect(result).toEqual([
      expect.objectContaining({
        value: -11,
        count: 2,
        minValue: -12,
        maxValue: -10,
      }),
    ]);
  });
});
