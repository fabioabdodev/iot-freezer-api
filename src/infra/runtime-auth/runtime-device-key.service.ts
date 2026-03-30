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
            status: true,
          },
        },
      },
    } as any);

    if (this.isClientBlocked((device as any)?.client?.status)) {
      return false;
    }

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
            status: true,
          },
        },
      },
    } as any);

    if (this.isClientBlocked((actuator as any)?.client?.status)) {
      return false;
    }

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
        select: { deviceApiKey: true, status: true },
      } as any);

      if (this.isClientBlocked(client?.status)) {
        return null;
      }

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
            status: true,
          },
        },
      },
    } as any);

    if (this.isClientBlocked((device as any)?.client?.status)) {
      return null;
    }

    return (
      (device as any)?.client?.deviceApiKey ??
      this.configService.get<string>('DEVICE_API_KEY')
    );
  }

  private isClientBlocked(status?: string | null) {
    return status === 'inactive';
  }
}
