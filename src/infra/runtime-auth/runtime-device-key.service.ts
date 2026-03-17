import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RuntimeDeviceKeyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async isValidForIngest(deviceKey: string | undefined, payload: {
    deviceId: string;
    clientId?: string;
  }) {
    if (!deviceKey) {
      return false;
    }

    const expectedKey = await this.resolveExpectedKeyForIngest(payload);
    return Boolean(expectedKey) && deviceKey === expectedKey;
  }

  async isValidForDevice(deviceKey: string | undefined, deviceId?: string) {
    if (!deviceKey || !deviceId) {
      return false;
    }

    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
      select: {
        client: {
          select: {
            deviceApiKey: true,
          },
        },
      },
    } as any);

    const expectedKey =
      (device as any)?.client?.deviceApiKey ??
      this.configService.get<string>('DEVICE_API_KEY');

    return Boolean(expectedKey) && deviceKey === expectedKey;
  }

  async isValidForActuator(deviceKey: string | undefined, actuatorId: string) {
    if (!deviceKey) {
      return false;
    }

    const actuator = await this.prisma.actuator.findUnique({
      where: { id: actuatorId },
      select: {
        client: {
          select: {
            deviceApiKey: true,
          },
        },
      },
    } as any);

    const expectedKey =
      (actuator as any)?.client?.deviceApiKey ??
      this.configService.get<string>('DEVICE_API_KEY');

    return Boolean(expectedKey) && deviceKey === expectedKey;
  }

  private async resolveExpectedKeyForIngest(payload: {
    deviceId: string;
    clientId?: string;
  }) {
    if (payload.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: payload.clientId },
        select: { deviceApiKey: true },
      } as any);

      if (client?.deviceApiKey) {
        return client.deviceApiKey;
      }
    }

    const device = await this.prisma.device.findUnique({
      where: { id: payload.deviceId },
      select: {
        client: {
          select: {
            deviceApiKey: true,
          },
        },
      },
    } as any);

    return (
      (device as any)?.client?.deviceApiKey ??
      this.configService.get<string>('DEVICE_API_KEY')
    );
  }
}
