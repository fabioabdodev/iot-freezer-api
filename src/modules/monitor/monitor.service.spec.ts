import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MonitorService } from './monitor.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertDeliveryQueueService } from '../../infra/alerts/alert-delivery-queue.service';

describe('MonitorService', () => {
  let service: MonitorService;
  let fakePrisma: any;
  let fakeConfigService: any;
  let fakeAlertQueue: { enqueue: jest.Mock };

  beforeEach(async () => {
    fakePrisma = {
      device: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      },
      temperatureLog: {
        findFirst: jest.fn(),
      },
      alertRule: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      alertRuleState: {
        upsert: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      },
    };

    fakeConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'DEVICE_OFFLINE_MINUTES') return 5;
        if (key === 'TEMPERATURE_ALERT_COOLDOWN_MINUTES') return 5;
        return undefined;
      }),
    };
    fakeAlertQueue = { enqueue: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorService,
        { provide: PrismaService, useValue: fakePrisma },
        { provide: ConfigService, useValue: fakeConfigService },
        { provide: AlertDeliveryQueueService, useValue: fakeAlertQueue },
      ],
    }).compile();

    service = module.get<MonitorService>(MonitorService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('enqueues offline alert when a device crosses offline threshold', async () => {
    const now = new Date('2026-03-07T10:00:00.000Z');
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime());

    fakePrisma.device.count.mockResolvedValue(1);
    fakePrisma.device.findMany.mockResolvedValueOnce([
      {
        id: 'dev1',
        clientId: 'client_a',
        lastSeen: new Date('2026-03-07T09:40:00.000Z'),
        isOffline: false,
      },
    ]);

    await service.checkOfflineDevices();

    expect(fakeAlertQueue.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'device_offline',
        deviceId: 'dev1',
        clientId: 'client_a',
      }),
    );
  });

  it('enqueues alert when configured temperature rule is violated', async () => {
    const now = new Date('2026-03-07T10:00:00.000Z');
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime());

    fakePrisma.alertRule.findMany.mockResolvedValue([
      {
        id: 'rule_1',
        clientId: 'client_a',
        deviceId: 'dev1',
        sensorType: 'temperature',
        minValue: 0,
        maxValue: 10,
        cooldownMinutes: 5,
        toleranceMinutes: 0,
        enabled: true,
      },
    ]);

    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'dev1',
      clientId: 'client_a',
    });
    fakePrisma.temperatureLog.findFirst.mockResolvedValue({ temperature: 15 });
    fakePrisma.alertRuleState.upsert.mockResolvedValue({
      id: 'state_1',
      breachStartedAt: null,
      lastTriggeredAt: null,
    });

    await service.checkOfflineDevices();

    expect(fakeAlertQueue.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'temperature_out_of_range',
        deviceId: 'dev1',
      }),
    );
    expect(fakePrisma.alertRuleState.update).toHaveBeenCalled();
  });

  it('does not send webhook before tolerance window is reached', async () => {
    const now = new Date('2026-03-07T10:00:00.000Z');
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime());

    fakePrisma.alertRule.findMany.mockResolvedValue([
      {
        id: 'rule_1',
        clientId: 'client_a',
        deviceId: 'dev1',
        sensorType: 'temperature',
        minValue: 0,
        maxValue: 10,
        cooldownMinutes: 5,
        toleranceMinutes: 10,
        enabled: true,
      },
    ]);

    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'dev1',
      clientId: 'client_a',
    });
    fakePrisma.temperatureLog.findFirst.mockResolvedValue({ temperature: 15 });
    fakePrisma.alertRuleState.upsert.mockResolvedValue({
      id: 'state_1',
      breachStartedAt: now,
      lastTriggeredAt: null,
    });

    await service.checkOfflineDevices();

    expect(fakeAlertQueue.enqueue).not.toHaveBeenCalled();
  });

  it('does not send webhook while cooldown is still active', async () => {
    const now = new Date('2026-03-07T10:00:00.000Z');
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime());

    fakePrisma.alertRule.findMany.mockResolvedValue([
      {
        id: 'rule_1',
        clientId: 'client_a',
        deviceId: 'dev1',
        sensorType: 'temperature',
        minValue: 0,
        maxValue: 10,
        cooldownMinutes: 5,
        toleranceMinutes: 0,
        enabled: true,
      },
    ]);

    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'dev1',
      clientId: 'client_a',
    });
    fakePrisma.temperatureLog.findFirst.mockResolvedValue({ temperature: 15 });
    fakePrisma.alertRuleState.upsert.mockResolvedValue({
      id: 'state_1',
      breachStartedAt: new Date('2026-03-07T09:50:00.000Z'),
      lastTriggeredAt: new Date('2026-03-07T09:57:00.000Z'),
    });

    await service.checkOfflineDevices();

    expect(fakeAlertQueue.enqueue).not.toHaveBeenCalled();
  });
});
