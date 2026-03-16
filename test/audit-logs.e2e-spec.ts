import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuditLogsController } from '../src/modules/audit-logs/audit-logs.controller';
import { AuditLogsService } from '../src/modules/audit-logs/audit-logs.service';
import { RoleGuard, SessionAuthGuard } from '../src/modules/auth/auth.guards';

describe('Audit Logs (e2e)', () => {
  let app: INestApplication;
  let authUser: any;

  beforeEach(async () => {
    authUser = {
      id: 'platform_admin',
      clientId: null,
      name: 'Admin Plataforma',
      email: 'plataforma@virtuagil.com.br',
      role: 'admin',
      phone: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date('2026-03-14T00:00:00.000Z'),
      updatedAt: new Date('2026-03-14T00:00:00.000Z'),
    };

    const rows = [
      {
        id: 'audit_2',
        clientId: 'cliente_teste',
        entityType: 'alert_rule',
        entityId: 'rule_1',
        action: 'alert_rule_updated',
        fieldName: null,
        previousValue: { minValue: 2, maxValue: 8 },
        nextValue: { minValue: 1, maxValue: 8 },
        actorUserId: 'tenant_admin',
        actorEmail: 'admin@cliente-teste.com.br',
        actorRole: 'admin',
        actorClientId: 'cliente_teste',
        createdAt: new Date('2026-03-14T12:10:00.000Z'),
      },
      {
        id: 'audit_1',
        clientId: 'virtuagil',
        entityType: 'device',
        entityId: 'freezer_01',
        action: 'temperature_bounds_updated',
        fieldName: 'minTemperature',
        previousValue: -20,
        nextValue: -22,
        actorUserId: 'tenant_admin_2',
        actorEmail: 'admin@virtuagil.com.br',
        actorRole: 'admin',
        actorClientId: 'virtuagil',
        createdAt: new Date('2026-03-14T12:00:00.000Z'),
      },
    ];

    const fakePrisma = {
      auditLog: {
        findMany: jest.fn(({ where, take }: any) => {
          let filtered = rows.slice();
          if (where?.clientId) filtered = filtered.filter((row) => row.clientId === where.clientId);
          if (where?.entityType) filtered = filtered.filter((row) => row.entityType === where.entityType);
          if (where?.entityId) filtered = filtered.filter((row) => row.entityId === where.entityId);
          if (where?.createdAt?.gte) {
            filtered = filtered.filter((row) => row.createdAt >= where.createdAt.gte);
          }
          if (where?.createdAt?.lte) {
            filtered = filtered.filter((row) => row.createdAt <= where.createdAt.lte);
          }
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          return Promise.resolve(filtered.slice(0, take));
        }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogsController],
      providers: [
        AuditLogsService,
        { provide: PrismaService, useValue: fakePrisma },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          context.switchToHttp().getRequest().authUser = authUser;
          return true;
        },
      })
      .overrideGuard(RoleGuard)
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

  it('should list audit logs for platform admin', async () => {
    await request(app.getHttpServer())
      .get('/audit-logs?limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            id: 'audit_2',
            entityType: 'alert_rule',
          }),
        );
      });
  });

  it('should scope audit logs to tenant admin clientId', async () => {
    authUser = {
      ...authUser,
      clientId: 'virtuagil',
      email: 'admin@virtuagil.com.br',
    };

    await request(app.getHttpServer())
      .get('/audit-logs')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            clientId: 'virtuagil',
            entityId: 'freezer_01',
          }),
        );
      });
  });

  it('should filter audit logs by entity and period', async () => {
    await request(app.getHttpServer())
      .get(
        '/audit-logs?entityType=device&entityId=freezer_01&from=2026-03-14T12:00:00.000Z&to=2026-03-14T12:05:00.000Z',
      )
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            id: 'audit_1',
            entityType: 'device',
            entityId: 'freezer_01',
          }),
        );
      });
  });
});
