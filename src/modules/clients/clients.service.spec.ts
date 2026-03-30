import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let fakePrisma: any;

  beforeEach(async () => {
    fakePrisma = {
      $transaction: jest.fn(async (callback) => callback(fakePrisma)),
      client: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      device: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      jadeContact: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      jadeConversation: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      jadeHumanHandoff: {
        deleteMany: jest.fn(),
      },
      jadeFollowUpQueue: {
        deleteMany: jest.fn(),
      },
      auditLog: {
        deleteMany: jest.fn(),
      },
      user: {
        deleteMany: jest.fn(),
      },
      actuationSchedule: {
        deleteMany: jest.fn(),
      },
      actuationCommand: {
        deleteMany: jest.fn(),
      },
      actuator: {
        deleteMany: jest.fn(),
      },
      clientModuleItem: {
        deleteMany: jest.fn(),
      },
      clientModule: {
        deleteMany: jest.fn(),
      },
      alertRule: {
        deleteMany: jest.fn(),
      },
      alertRuleState: {
        deleteMany: jest.fn(),
      },
      temperatureLog: {
        deleteMany: jest.fn(),
      },
      sensorReading: {
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: fakePrisma },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should create client', async () => {
    fakePrisma.client.findUnique.mockResolvedValue(null);
    fakePrisma.client.findFirst.mockResolvedValue(null);
    fakePrisma.client.create.mockResolvedValue({
      id: 'client_a',
      name: 'Client A',
      status: 'active',
      adminName: 'Ana Gestora',
      alertContactName: 'Operacao Cliente A',
      document: '11222333000181',
      adminPhone: '5531999999999',
      alertPhone: '5531999999999',
      billingPhone: '5531988887777',
      billingEmail: 'financeiro@clientea.com',
    });
    const result = await service.create({
      id: 'client_a',
      name: 'Client A',
      adminName: 'Ana Gestora',
      alertContactName: 'Operacao Cliente A',
      document: '11.222.333/0001-81',
      adminPhone: '(31) 99999-9999',
      alertPhone: '(31) 99999-9999',
      billingPhone: '(31) 98888-7777',
      billingEmail: 'financeiro@clientea.com',
    });
    expect(fakePrisma.client.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        id: 'client_a',
        name: 'Client A',
        adminName: 'Ana Gestora',
        alertContactName: 'Operacao Cliente A',
        document: '11222333000181',
        adminPhone: '5531999999999',
        alertPhone: '5531999999999',
        billingPhone: '5531988887777',
        billingEmail: 'financeiro@clientea.com',
        status: 'active',
      }),
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: 'client_a',
        name: 'Client A',
        status: 'active',
        billingEmail: 'financeiro@clientea.com',
      }),
    );
  });

  it('should throw not found when client does not exist', async () => {
    fakePrisma.client.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should include duplicated client name and id when phone already exists', async () => {
    fakePrisma.client.findUnique.mockResolvedValue(null);
    fakePrisma.client.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'cliente-duplicado',
        name: 'Cliente Duplicado',
      });

    await expect(
      service.create({
        id: 'client_novo',
        name: 'Client Novo',
        adminName: 'Novo Admin',
        alertContactName: 'Operacao Cliente Novo',
        document: '11.222.333/0001-81',
        adminPhone: '(31) 99999-9999',
        alertPhone: '(31) 99999-9999',
        billingPhone: '(31) 98888-7777',
        billingEmail: 'financeiro@clientenovo.com',
      }),
    ).rejects.toMatchObject<Partial<ConflictException>>({
      message:
        'Ja existe um cliente com este telefone: Cliente Duplicado (cliente-duplicado). Campos: WhatsApp do contato principal, WhatsApp principal para alertas. [field:adminPhone|alertPhone]',
    });
  });

  it('should hard delete client operational data and devices', async () => {
    fakePrisma.client.findUnique.mockResolvedValue({
      id: 'client_a',
      name: 'Client A',
    });
    fakePrisma.device.findMany.mockResolvedValue([
      { id: 'freezer_01' },
      { id: 'freezer_02' },
    ]);
    fakePrisma.jadeContact.findMany.mockResolvedValue([
      { leadPhone: '5531999999999' },
    ]);
    fakePrisma.jadeConversation.findMany.mockResolvedValue([
      { leadPhone: '5531988887777' },
    ]);
    fakePrisma.client.delete.mockResolvedValue({
      id: 'client_a',
      name: 'Client A',
    });

    const result = await service.remove('client_a');

    expect(fakePrisma.temperatureLog.deleteMany).toHaveBeenCalledWith({
      where: { deviceId: { in: ['freezer_01', 'freezer_02'] } },
    });
    expect(fakePrisma.sensorReading.deleteMany).toHaveBeenCalledWith({
      where: { deviceId: { in: ['freezer_01', 'freezer_02'] } },
    });
    expect(fakePrisma.device.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['freezer_01', 'freezer_02'] } },
    });
    expect(fakePrisma.jadeHumanHandoff.deleteMany).toHaveBeenCalledWith({
      where: { leadPhone: { in: ['5531999999999', '5531988887777'] } },
    });
    expect(fakePrisma.client.delete).toHaveBeenCalledWith({
      where: { id: 'client_a' },
    });
    expect(result).toEqual({
      id: 'client_a',
      name: 'Client A',
    });
  });
});
