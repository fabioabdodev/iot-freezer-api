import { ConfigService } from '@nestjs/config';
import { RuntimeDeviceKeyService } from './runtime-device-key.service';

describe('RuntimeDeviceKeyService', () => {
  let service: RuntimeDeviceKeyService;
  let prisma: {
    client: { findUnique: jest.Mock };
    device: { findUnique: jest.Mock };
    actuator: { findUnique: jest.Mock };
  };
  let configService: { get: jest.Mock };

  beforeEach(() => {
    prisma = {
      client: { findUnique: jest.fn() },
      device: { findUnique: jest.fn() },
      actuator: { findUnique: jest.fn() },
    };
    configService = {
      get: jest.fn(),
    };

    service = new RuntimeDeviceKeyService(
      prisma as any,
      configService as unknown as ConfigService,
    );
  });

  it('blocks ingest for inactive client even with valid key', async () => {
    prisma.client.findUnique.mockResolvedValue({
      deviceApiKey: 'expected-key',
      status: 'inactive',
    });

    await expect(
      service.isValidForIngest('expected-key', {
        clientId: 'cliente_teste',
        deviceId: 'freezer_01',
      }),
    ).resolves.toBe(false);
  });

  it('allows ingest for delinquent client with valid key', async () => {
    prisma.client.findUnique.mockResolvedValue({
      deviceApiKey: 'expected-key',
      status: 'delinquent',
    });

    await expect(
      service.isValidForIngest('expected-key', {
        clientId: 'cliente_teste',
        deviceId: 'freezer_01',
      }),
    ).resolves.toBe(true);
  });

  it('blocks actuator polling for inactive client', async () => {
    prisma.device.findUnique.mockResolvedValue({
      client: {
        deviceApiKey: 'expected-key',
        status: 'inactive',
      },
    });

    await expect(
      service.isValidForDevice('expected-key', 'freezer_01'),
    ).resolves.toBe(false);
  });

  it('blocks actuator ack for inactive client', async () => {
    prisma.actuator.findUnique.mockResolvedValue({
      client: {
        deviceApiKey: 'expected-key',
        status: 'inactive',
      },
    });

    await expect(
      service.isValidForActuator('expected-key', 'rele_01'),
    ).resolves.toBe(false);
  });
});
