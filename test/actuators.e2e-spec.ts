import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ActuatorsController } from '../src/modules/actuators/actuators.controller';
import { ActuatorsService } from '../src/modules/actuators/actuators.service';
import { ActuationSchedulesService } from '../src/modules/actuators/actuation-schedules.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ModuleAccessGuard, SessionAuthGuard } from '../src/modules/auth/auth.guards';
import { IotActuationController } from '../src/modules/actuators/iot-actuation.controller';
import { ConfigService } from '@nestjs/config';
import { AuditTrailService } from '../src/infra/audit/audit-trail.service';
import { RuntimeDeviceKeyService } from '../src/infra/runtime-auth/runtime-device-key.service';

describe('Actuators (e2e)', () => {
  let app: INestApplication;
  let authUser: any;

  beforeEach(async () => {
    const clients = new Map<string, any>();
    const devices = new Map<string, any>();
    const actuators = new Map<string, any>();
    const schedules = new Map<string, any>();
    const commands: Array<any> = [];

    clients.set('client_a', { id: 'client_a', name: 'Client A' });
    devices.set('device_a', { id: 'device_a', clientId: 'client_a' });
    authUser = {
      id: 'platform_admin',
      clientId: null,
      name: 'Platform Admin',
      email: 'plataforma@virtuagil.com.br',
      role: 'admin',
      phone: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date('2026-03-13T00:00:00.000Z'),
      updatedAt: new Date('2026-03-13T00:00:00.000Z'),
    };

    const fakePrisma = {
      client: {
        findUnique: jest.fn(({ where }: any) =>
          Promise.resolve(clients.get(where.id) ?? null),
        ),
      },
      device: {
        findUnique: jest.fn(({ where }: any) =>
          Promise.resolve(devices.get(where.id) ?? null),
        ),
      },
      actuator: {
        create: jest.fn(({ data }: any) => {
          const row = {
            ...data,
            location: data.location ?? null,
            deviceId: data.deviceId ?? null,
            lastCommandAt: null,
            lastCommandBy: null,
            createdAt: new Date('2026-03-13T00:00:00.000Z'),
            updatedAt: new Date('2026-03-13T00:00:00.000Z'),
          };
          actuators.set(data.id, row);
          return Promise.resolve(row);
        }),
        findMany: jest.fn(({ where }: any = {}) => {
          let rows = Array.from(actuators.values());
          if (where?.clientId) rows = rows.filter((row) => row.clientId === where.clientId);
          if (where?.deviceId) rows = rows.filter((row) => row.deviceId === where.deviceId);
          if (where?.currentState) {
            rows = rows.filter((row) => row.currentState === where.currentState);
          }
          rows.sort((a, b) => a.id.localeCompare(b.id));
          return Promise.resolve(rows);
        }),
        findUnique: jest.fn(({ where }: any) =>
          Promise.resolve(actuators.get(where.id) ?? null),
        ),
        update: jest.fn(({ where, data }: any) => {
          const current = actuators.get(where.id);
          const updated = {
            ...current,
            ...data,
            updatedAt: new Date('2026-03-13T00:10:00.000Z'),
          };
          actuators.set(where.id, updated);
          return Promise.resolve(updated);
        }),
        delete: jest.fn(({ where }: any) => {
          const row = actuators.get(where.id);
          actuators.delete(where.id);
          return Promise.resolve(row);
        }),
      },
      actuationSchedule: {
        create: jest.fn(({ data }: any) => {
          const row = {
            id: `schedule_${schedules.size + 1}`,
            ...data,
            createdAt: new Date('2026-03-13T00:00:00.000Z'),
            updatedAt: new Date('2026-03-13T00:00:00.000Z'),
          };
          schedules.set(row.id, row);
          return Promise.resolve(row);
        }),
        findMany: jest.fn(({ where }: any = {}) => {
          let rows = Array.from(schedules.values());
          if (where?.clientId) rows = rows.filter((row) => row.clientId === where.clientId);
          if (where?.actuatorId) rows = rows.filter((row) => row.actuatorId === where.actuatorId);
          if (typeof where?.enabled === 'boolean') rows = rows.filter((row) => row.enabled === where.enabled);
          return Promise.resolve(
            rows.map((row) => ({
              ...row,
              actuator: actuators.get(row.actuatorId) ?? null,
            })),
          );
        }),
        findUnique: jest.fn(({ where }: any) =>
          Promise.resolve(schedules.get(where.id) ?? null),
        ),
        update: jest.fn(({ where, data }: any) => {
          const current = schedules.get(where.id);
          const updated = {
            ...current,
            ...data,
            updatedAt: new Date('2026-03-13T00:10:00.000Z'),
          };
          schedules.set(where.id, updated);
          return Promise.resolve(updated);
        }),
        delete: jest.fn(({ where }: any) => {
          const row = schedules.get(where.id);
          schedules.delete(where.id);
          return Promise.resolve(row);
        }),
      },
      actuationCommand: {
        create: jest.fn(({ data }: any) => {
          const row = {
            id: `cmd_${commands.length + 1}`,
            ...data,
          };
          commands.unshift(row);
          return Promise.resolve(row);
        }),
        findMany: jest.fn(({ where, take }: any) => {
          let rows = commands;
          if (where?.actuatorId) {
            rows = rows.filter((row) => row.actuatorId === where.actuatorId);
          }
          if (where?.clientId) {
            rows = rows.filter((row) => row.clientId === where.clientId);
          }
          rows = rows.slice(0, take).map((row) => ({
            ...row,
            actuator: actuators.get(row.actuatorId) ?? null,
          }));
          return Promise.resolve(rows);
        }),
      },
      clientModule: {
        findUnique: jest.fn(() =>
          Promise.resolve({ enabled: true }),
        ),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ActuatorsController, IotActuationController],
      providers: [
        ActuatorsService,
        ActuationSchedulesService,
        { provide: PrismaService, useValue: fakePrisma },
        { provide: AuditTrailService, useValue: { record: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) =>
              key === 'DEVICE_API_KEY' ? 'expected-key' : undefined,
            ),
          },
        },
        {
          provide: RuntimeDeviceKeyService,
          useValue: {
            isValidForDevice: jest.fn((deviceKey: string | undefined) =>
              Promise.resolve(deviceKey === 'expected-key'),
            ),
            isValidForActuator: jest.fn((deviceKey: string | undefined) =>
              Promise.resolve(deviceKey === 'expected-key'),
            ),
          },
        },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          context.switchToHttp().getRequest().authUser = authUser;
          return true;
        },
      })
      .overrideGuard(ModuleAccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  it('should create actuator and issue command with history', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'sauna_main',
        clientId: 'client_a',
        deviceId: 'device_a',
        name: 'Sauna principal',
        location: 'Area molhada',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: 'sauna_main',
            currentState: 'off',
          }),
        );
      });

    await request(app.getHttpServer())
      .post('/actuators/sauna_main/commands')
      .send({
        desiredState: 'on',
        source: 'dashboard',
        note: 'Pre-aquecimento',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            desiredState: 'on',
            actuator: expect.objectContaining({
              id: 'sauna_main',
              currentState: 'on',
              lastCommandBy: 'dashboard',
            }),
          }),
        );
      });

    await request(app.getHttpServer())
      .get('/actuators/sauna_main/commands')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            actuatorId: 'sauna_main',
            desiredState: 'on',
            source: 'dashboard',
          }),
        );
      });
  });

  it('should reject actuator creation when device belongs to another client', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'sauna_main',
        clientId: 'client_a',
        deviceId: 'missing_device',
        name: 'Sauna principal',
      })
      .expect(400);
  });

  it('should update actuator fields', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'sauna_main',
        clientId: 'client_a',
        deviceId: 'device_a',
        name: 'Sauna principal',
        location: 'Area molhada',
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch('/actuators/sauna_main')
      .send({
        name: 'Sauna premium',
        location: 'Spa interno',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: 'sauna_main',
            name: 'Sauna premium',
            location: 'Spa interno',
          }),
        );
      });
  });

  it('should list recent commands for the scoped client', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'sauna_main',
        clientId: 'client_a',
        deviceId: 'device_a',
        name: 'Sauna principal',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/actuators/sauna_main/commands')
      .send({
        desiredState: 'on',
        source: 'dashboard',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/actuators/commands/recent?limit=5')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            actuatorId: 'sauna_main',
            clientId: 'client_a',
            desiredState: 'on',
            actuator: expect.objectContaining({
              id: 'sauna_main',
            }),
          }),
        );
      });
  });

  it('should delete actuator and return 404 afterwards', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'sauna_main',
        clientId: 'client_a',
        name: 'Sauna principal',
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete('/actuators/sauna_main')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: 'sauna_main',
          }),
        );
      });

    await request(app.getHttpServer())
      .get('/actuators/sauna_main')
      .expect(404);
  });

  it('should expose runtime actuator state for device polling with x-device-key', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'relay_freezer',
        clientId: 'client_a',
        deviceId: 'device_a',
        name: 'Rele freezer',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/actuators/relay_freezer/commands')
      .send({
        desiredState: 'on',
        source: 'dashboard',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/iot/actuators?deviceId=device_a')
      .set('x-device-key', 'expected-key')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([
          expect.objectContaining({
            id: 'relay_freezer',
            deviceId: 'device_a',
            currentState: 'on',
            lastCommandBy: 'dashboard',
          }),
        ]);
      });
  });

  it('should reject runtime actuator polling without valid x-device-key', async () => {
    await request(app.getHttpServer())
      .get('/iot/actuators?deviceId=device_a')
      .expect(401);
  });

  it('should accept runtime ack from hardware and persist applied state', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'relay_freezer',
        clientId: 'client_a',
        deviceId: 'device_a',
        name: 'Rele freezer',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/iot/actuators/relay_freezer/ack')
      .set('x-device-key', 'expected-key')
      .send({
        appliedState: 'on',
        success: true,
        message: 'rele acionado com sucesso',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            ok: true,
            success: true,
            actuator: expect.objectContaining({
              id: 'relay_freezer',
              currentState: 'on',
              lastCommandBy: 'device_ack',
            }),
            command: expect.objectContaining({
              actuatorId: 'relay_freezer',
              desiredState: 'on',
              source: 'device_ack',
              note: 'rele acionado com sucesso',
            }),
          }),
        );
      });
  });

  it('should reject runtime ack without valid x-device-key', async () => {
    await request(app.getHttpServer())
      .post('/iot/actuators/relay_freezer/ack')
      .send({
        appliedState: 'on',
      })
      .expect(401);
  });

  it('should create and update actuation schedules for tenant admin', async () => {
    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'sauna_main',
        clientId: 'client_a',
        deviceId: 'device_a',
        name: 'Sauna principal',
      })
      .expect(201);

    authUser = {
      id: 'tenant_admin',
      clientId: 'client_a',
      name: 'Admin Client A',
      email: 'admin@clienta.com.br',
      role: 'admin',
      phone: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date('2026-03-13T00:00:00.000Z'),
      updatedAt: new Date('2026-03-13T00:00:00.000Z'),
    };

    await request(app.getHttpServer())
      .post('/actuators/schedules')
      .send({
        clientId: 'client_a',
        actuatorId: 'sauna_main',
        name: 'Sauna seg qua sex',
        weekdays: ['mon', 'wed', 'fri'],
        startMinutes: 960,
        endMinutes: 1200,
        timezone: 'America/Sao_Paulo',
        enabled: true,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            clientId: 'client_a',
            actuatorId: 'sauna_main',
            name: 'Sauna seg qua sex',
            enabled: true,
          }),
        );
      });

    await request(app.getHttpServer())
      .get('/actuators/schedules?clientId=client_a')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            actuatorId: 'sauna_main',
            startMinutes: 960,
            endMinutes: 1200,
          }),
        );
      });

    const scheduleId = (await request(app.getHttpServer()).get('/actuators/schedules?clientId=client_a')).body[0].id;

    await request(app.getHttpServer())
      .patch(`/actuators/schedules/${scheduleId}`)
      .send({
        name: 'Sauna semana',
        enabled: false,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            name: 'Sauna semana',
            enabled: false,
          }),
        );
      });
  });

  it('should reject actuator creation for tenant admin', async () => {
    authUser = {
      id: 'tenant_admin',
      clientId: 'client_a',
      name: 'Admin Client A',
      email: 'admin@clienta.com.br',
      role: 'admin',
      phone: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date('2026-03-13T00:00:00.000Z'),
      updatedAt: new Date('2026-03-13T00:00:00.000Z'),
    };

    await request(app.getHttpServer())
      .post('/actuators')
      .send({
        id: 'quadra_luzes',
        clientId: 'client_a',
        name: 'Luzes da quadra',
      })
      .expect(403);
  });
});
