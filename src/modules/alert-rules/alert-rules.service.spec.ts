import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertRulesService } from './alert-rules.service';

describe('AlertRulesService', () => {
  let service: AlertRulesService;
  let fakePrisma: any;

  beforeEach(async () => {
    fakePrisma = {
      client: {
        findUnique: jest.fn(),
      },
      device: {
        findUnique: jest.fn(),
      },
      alertRule: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertRulesService,
        { provide: PrismaService, useValue: fakePrisma },
      ],
    }).compile();

    service = module.get<AlertRulesService>(AlertRulesService);
  });

  it('should create alert rule', async () => {
    fakePrisma.client.findUnique.mockResolvedValue({ id: 'client_a' });
    fakePrisma.device.findUnique.mockResolvedValue({
      id: 'freezer_01',
      clientId: 'client_a',
    });
    fakePrisma.alertRule.create.mockResolvedValue({ id: 'rule_1' });

    const result = await service.create({
      clientId: 'client_a',
      deviceId: 'freezer_01',
      sensorType: 'temperature',
      minValue: -20,
      maxValue: -10,
    } as any);

    expect(result).toEqual({ id: 'rule_1' });
  });

  it('should throw when minValue is greater than maxValue', async () => {
    await expect(
      service.create({
        clientId: 'client_a',
        sensorType: 'temperature',
        minValue: 10,
        maxValue: 5,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw when alert rule is not found', async () => {
    fakePrisma.alertRule.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

