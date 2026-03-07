import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let fakePrisma: any;

  beforeEach(async () => {
    fakePrisma = {
      client: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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
    fakePrisma.client.create.mockResolvedValue({ id: 'client_a', name: 'Client A' });
    const result = await service.create({ id: 'client_a', name: 'Client A' });
    expect(result).toEqual({ id: 'client_a', name: 'Client A' });
  });

  it('should throw not found when client does not exist', async () => {
    fakePrisma.client.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});

