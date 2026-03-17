import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { RuntimeDeviceKeyService } from '../../infra/runtime-auth/runtime-device-key.service';

describe('IngestController', () => {
  let controller: IngestController;
  let fakeIngestService: { ingestTemperature: jest.Mock };
  let fakeRuntimeDeviceKeyService: { isValidForIngest: jest.Mock };

  beforeEach(async () => {
    fakeIngestService = {
      ingestTemperature: jest.fn(),
    };

    fakeRuntimeDeviceKeyService = {
      isValidForIngest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        { provide: IngestService, useValue: fakeIngestService },
        {
          provide: RuntimeDeviceKeyService,
          useValue: fakeRuntimeDeviceKeyService,
        },
      ],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should throw UnauthorizedException when x-device-key is missing', async () => {
    fakeRuntimeDeviceKeyService.isValidForIngest.mockResolvedValue(false);

    await expect(
      controller.temperature(undefined, {
        device_id: 'freezer_01',
        temperature: -12.3,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });

  it('should ingest temperature when x-device-key is valid', async () => {
    fakeRuntimeDeviceKeyService.isValidForIngest.mockResolvedValue(true);
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
    fakeRuntimeDeviceKeyService.isValidForIngest.mockResolvedValue(false);

    await expect(
      controller.temperature('wrong-key', {
        device_id: 'freezer_01',
        temperature: -12.3,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(fakeIngestService.ingestTemperature).not.toHaveBeenCalled();
  });
});
