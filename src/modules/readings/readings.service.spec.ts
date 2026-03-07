import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ReadingsService } from './readings.service';

describe('ReadingsService', () => {
  let service: ReadingsService;
  let fakePrisma: any;

  beforeEach(async () => {
    fakePrisma = {
      device: { findUnique: jest.fn() },
      temperatureLog: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingsService,
        { provide: PrismaService, useValue: fakePrisma },
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
});
