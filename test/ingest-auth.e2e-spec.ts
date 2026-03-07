import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { IngestController } from '../src/modules/ingest/ingest.controller';
import { IngestService } from '../src/modules/ingest/ingest.service';

describe('Ingest Auth (e2e)', () => {
  let app: INestApplication;
  let fakeIngestService: { ingestTemperature: jest.Mock };

  beforeEach(async () => {
    fakeIngestService = {
      ingestTemperature: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        { provide: IngestService, useValue: fakeIngestService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('expected-key') },
        },
      ],
    }).compile();

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
    await app.close();
  });

  it('POST /iot/temperature should return 401 without x-device-key', async () => {
    await request(app.getHttpServer())
      .post('/iot/temperature')
      .send({ device_id: 'freezer_01', temperature: -12.3 })
      .expect(401);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });

  it('POST /iot/temperature should return 200 with valid x-device-key', async () => {
    await request(app.getHttpServer())
      .post('/iot/temperature')
      .set('x-device-key', 'expected-key')
      .send({ device_id: 'freezer_01', temperature: -12.3 })
      .expect(200);

    expect(fakeIngestService.ingestTemperature).toHaveBeenCalledWith({
      device_id: 'freezer_01',
      temperature: -12.3,
    });
  });

  it('POST /iot/temperature should return 401 with invalid x-device-key', async () => {
    await request(app.getHttpServer())
      .post('/iot/temperature')
      .set('x-device-key', 'wrong-key')
      .send({ device_id: 'freezer_01', temperature: -12.3 })
      .expect(401);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });

  it('POST /iot/temperature should return 400 with invalid device_id format', async () => {
    await request(app.getHttpServer())
      .post('/iot/temperature')
      .set('x-device-key', 'expected-key')
      .send({ device_id: 'freezer 01', temperature: -12.3 })
      .expect(400);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });
});
