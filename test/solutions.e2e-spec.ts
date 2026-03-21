import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { SolutionsController } from '../src/modules/solutions/solutions.controller';
import { SolutionsService } from '../src/modules/solutions/solutions.service';
import { RoleGuard, SessionAuthGuard } from '../src/modules/auth/auth.guards';

describe('Solutions (e2e)', () => {
  let app: INestApplication;
  let authUser: any;

  beforeEach(async () => {
    authUser = {
      id: 'user_platform_admin',
      clientId: null,
      name: 'Admin Plataforma',
      email: 'plataforma@virtuagil.com.br',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2026-03-13T00:00:00.000Z'),
      updatedAt: new Date('2026-03-13T00:00:00.000Z'),
    };

    const clients = new Map<string, any>([
      ['virtuagil', { id: 'virtuagil', name: 'Virtuagil Demo' }],
    ]);

    const moduleCatalogItems = [
      { key: 'temperatura', moduleKey: 'ambiental' },
      { key: 'umidade', moduleKey: 'ambiental' },
      { key: 'gases', moduleKey: 'ambiental' },
      { key: 'rele', moduleKey: 'acionamento' },
      { key: 'consumo', moduleKey: 'energia' },
    ];

    const accessRows = new Map<string, any>();

    const fakePrisma = {
      client: {
        findUnique: jest.fn(({ where }: any) =>
          Promise.resolve(clients.get(where.id) ?? null),
        ),
      },
      moduleCatalogItem: {
        findMany: jest.fn(({ where }: any) => {
          if (!where?.key?.in) return Promise.resolve(moduleCatalogItems);
          const wanted = new Set(where.key.in);
          return Promise.resolve(
            moduleCatalogItems.filter((item) => wanted.has(item.key)),
          );
        }),
      },
      clientModuleItem: {
        findMany: jest.fn(({ where }: any) => {
          const rows = Array.from(accessRows.values()).filter((row) => {
            if (row.clientId !== where.clientId) return false;
            if (where.enabled != null && row.enabled !== where.enabled) return false;
            return true;
          });
          rows.sort((a, b) => a.itemKey.localeCompare(b.itemKey));
          return Promise.resolve(rows);
        }),
        upsert: jest.fn(({ where, update, create }: any) => {
          const key = `${where.clientId_itemKey.clientId}:${where.clientId_itemKey.itemKey}`;
          const current = accessRows.get(key);
          const row =
            current != null
              ? { ...current, ...update, updatedAt: new Date() }
              : {
                  id: `item_${accessRows.size + 1}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...create,
                };

          accessRows.set(key, row);
          return Promise.resolve(row);
        }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SolutionsController],
      providers: [SolutionsService, { provide: PrismaService, useValue: fakePrisma }],
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

  it('should list catalog and apply cadeia_fria recipe for a client', async () => {
    await request(app.getHttpServer())
      .get('/solutions/catalog')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              key: 'cadeia_fria',
              version: 'v1',
              requiredItems: expect.any(Array),
              recommendedItems: expect.any(Array),
            }),
          ]),
        );
      });

    await request(app.getHttpServer())
      .get('/solutions?clientId=virtuagil')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              key: 'cadeia_fria',
              ready: false,
              required: expect.objectContaining({
                total: 3,
                enabled: 0,
              }),
            }),
          ]),
        );
      });

    await request(app.getHttpServer())
      .post('/solutions/apply')
      .send({
        clientId: 'virtuagil',
        solutionKey: 'cadeia_fria',
        version: 'v1',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            clientId: 'virtuagil',
            solutionKey: 'cadeia_fria',
            version: 'v1',
            appliedItemKeys: expect.arrayContaining([
              'temperatura',
              'umidade',
              'gases',
              'rele',
              'consumo',
            ]),
          }),
        );
      });

    await request(app.getHttpServer())
      .get('/solutions?clientId=virtuagil')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              key: 'cadeia_fria',
              ready: true,
              required: expect.objectContaining({
                total: 3,
                enabled: 3,
              }),
              recommended: expect.objectContaining({
                total: 2,
                enabled: 2,
              }),
            }),
          ]),
        );
      });
  });

  it('should block operator from applying solution recipe', async () => {
    authUser = {
      ...authUser,
      role: 'operator',
      clientId: 'virtuagil',
      email: 'operator@virtuagil.com.br',
    };

    await request(app.getHttpServer())
      .post('/solutions/apply')
      .send({
        clientId: 'virtuagil',
        solutionKey: 'cadeia_fria',
      })
      .expect(403);
  });
});
