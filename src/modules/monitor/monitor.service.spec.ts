import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MonitorService } from './monitor.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MonitorService', () => {
  let service: MonitorService;
  let fakePrisma: any;
  let fakeConfigService: any;
  let fetchMock: jest.Mock;

  beforeEach(async () => {
    fakePrisma = {
      device: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      temperatureLog: {
        findFirst: jest.fn(),
      },
    };
    fakeConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'DEVICE_OFFLINE_MINUTES') return 5;
        if (key === 'N8N_TEMPERATURE_ALERT_WEBHOOK_URL') return undefined;
        return undefined;
      }),
    };
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (global as any).fetch = fetchMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorService,
        { provide: PrismaService, useValue: fakePrisma },
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    service = module.get<MonitorService>(MonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('warns when a device has a temperature outside its limits', async () => {
    // prepare one device with limits and an out-of-range log
    const device = { id: 'dev1', minTemperature: 0, maxTemperature: 10, lastAlertAt: null };
    fakePrisma.device.findMany
      .mockResolvedValueOnce([]) // offlineCandidates (no offline devices)
      .mockResolvedValueOnce([]) // allDevices for logging (ignored)
      .mockResolvedValueOnce([device]); // devicesWithLimits

    fakePrisma.temperatureLog.findFirst.mockResolvedValue({ temperature: 15 });

    const warnSpy = jest.spyOn((service as any).logger, 'warn');

    await service.checkOfflineDevices();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('temperatura fora do limite'),
    );
    expect(fakePrisma.device.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'dev1' },
        data: { lastAlertAt: expect.any(Date) },
      }),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends webhook when temperature is outside limits and webhook is configured', async () => {
    const device = { id: 'dev1', minTemperature: 0, maxTemperature: 10, lastAlertAt: null };
    fakePrisma.device.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([device]);

    fakePrisma.temperatureLog.findFirst.mockResolvedValue({ temperature: 15 });

    fakeConfigService.get = jest.fn((key: string) => {
      if (key === 'DEVICE_OFFLINE_MINUTES') return 5;
      if (key === 'N8N_TEMPERATURE_ALERT_WEBHOOK_URL') return 'https://example.com/webhook';
      return undefined;
    });

    await service.checkOfflineDevices();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
});
