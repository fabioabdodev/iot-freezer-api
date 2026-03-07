import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

describe('IngestController', () => {
  let controller: IngestController;
  let fakeIngestService: { ingestTemperature: jest.Mock };
  let fakeConfigService: { get: jest.Mock };

  beforeEach(async () => {
    fakeIngestService = {
      ingestTemperature: jest.fn(),
    };

    fakeConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        { provide: IngestService, useValue: fakeIngestService },
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should throw UnauthorizedException when x-device-key is missing', async () => {
    fakeConfigService.get.mockReturnValue('expected-key');

    await expect(
      controller.temperature(undefined, {
        device_id: 'freezer_01',
        temperature: -12.3,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });

  it('should ingest temperature when x-device-key is valid', async () => {
    fakeConfigService.get.mockReturnValue('expected-key');
    fakeIngestService.ingestTemperature.mockResolvedValue(undefined);

    await expect(
      controller.temperature('expected-key', {
        device_id: 'freezer_01',
        temperature: -12.3,
      }),
    ).resolves.toEqual({ ok: true });

    expect(fakeIngestService.ingestTemperature).toHaveBeenCalledWith({
      device_id: 'freezer_01',
      temperature: -12.3,
    });
  });

  it('should throw UnauthorizedException when x-device-key is invalid', async () => {
    fakeConfigService.get.mockReturnValue('expected-key');

    await expect(
      controller.temperature('wrong-key', {
        device_id: 'freezer_01',
        temperature: -12.3,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when DEVICE_API_KEY is not configured', async () => {
    fakeConfigService.get.mockReturnValue(undefined);

    await expect(
      controller.temperature('any-key', {
        device_id: 'freezer_01',
        temperature: -12.3,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });
});
