import { ActuatorsService } from './actuators.service';

describe('ActuatorsService', () => {
  const originalEnv = process.env;
  let service: ActuatorsService;
  let prisma: any;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    process.env = { ...originalEnv };
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (global as any).fetch = fetchMock;

    prisma = {
      actuator: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'rele_test_01',
          clientId: 'cliente_a',
          deviceId: 'adega_01',
          name: 'Rele Teste',
          location: 'restaurante-centro',
          currentState: 'off',
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      actuationCommand: {
        create: jest.fn().mockResolvedValue({
          id: 'cmd_01',
          actuatorId: 'rele_test_01',
          desiredState: 'on',
          executedAt: new Date('2026-03-20T12:00:00.000Z'),
        }),
      },
      client: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'cliente_a',
          name: 'Cliente A',
          document: '11222333000181',
          alertPhone: '5531999999999',
          adminPhone: '5531888888888',
          phone: '5531777777777',
          actuationNotifyCooldownMinutes: null,
        }),
      },
      device: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'adega_01',
          name: 'Adega 01',
          location: 'restaurante-centro',
        }),
      },
    };

    service = new ActuatorsService(prisma);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('does not send webhook when actuation notifications are disabled', async () => {
    process.env.N8N_ACTUATION_WEBHOOK_URL =
      'https://webhookworkflow.virtuagil.com.br/webhook/actuation-command';
    process.env.ACTUATION_NOTIFY_ENABLED = 'false';

    await service.createCommand(
      'rele_test_01',
      {
        desiredState: 'on',
        source: 'dashboard',
      },
      'cliente_a',
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends webhook when enabled and source is allowed', async () => {
    process.env.N8N_ACTUATION_WEBHOOK_URL =
      'https://webhookworkflow.virtuagil.com.br/webhook/actuation-command';
    process.env.ACTUATION_NOTIFY_ENABLED = 'true';
    process.env.ACTUATION_NOTIFY_SOURCES = 'dashboard,lab-sabor-serra';
    process.env.ACTUATION_NOTIFY_COOLDOWN_SECONDS = '600';

    await service.createCommand(
      'rele_test_01',
      {
        desiredState: 'on',
        source: 'dashboard',
      },
      'cliente_a',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://webhookworkflow.virtuagil.com.br/webhook/actuation-command',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"type":"actuation_command"'),
      }),
    );
  });

  it('uses client cooldown in minutes when configured', async () => {
    process.env.N8N_ACTUATION_WEBHOOK_URL =
      'https://webhookworkflow.virtuagil.com.br/webhook/actuation-command';
    process.env.ACTUATION_NOTIFY_ENABLED = 'true';
    process.env.ACTUATION_NOTIFY_SOURCES = 'dashboard';
    process.env.ACTUATION_NOTIFY_COOLDOWN_SECONDS = '900';
    prisma.client.findUnique.mockResolvedValueOnce({
      id: 'cliente_a',
      name: 'Cliente A',
      document: '11222333000181',
      alertPhone: '5531999999999',
      adminPhone: '5531888888888',
      phone: '5531777777777',
      actuationNotifyCooldownMinutes: 2,
    });

    await service.createCommand(
      'rele_test_01',
      {
        desiredState: 'on',
        source: 'dashboard',
      },
      'cliente_a',
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.cooldown_minutes).toBe(2);
    expect(body.cooldown_seconds).toBe(120);
  });
});
