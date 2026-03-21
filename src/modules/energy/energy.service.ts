import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReadingsService } from '../readings/readings.service';

const ENERGY_SENSORS = new Set(['corrente', 'tensao', 'consumo']);

@Injectable()
export class EnergyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readingsService: ReadingsService,
  ) {}

  async listDeviceReadings(input: {
    deviceId: string;
    clientId?: string;
    sensor?: string;
    limit?: number;
    resolution?: string;
  }) {
    const sensor = this.normalizeEnergySensor(input.sensor ?? 'consumo');
    return this.readingsService.listByDevice(
      input.deviceId,
      input.clientId,
      sensor,
      input.limit ?? 100,
      input.resolution,
    );
  }

  async getClientSummary(input: {
    clientId: string;
    sensors?: string[];
    recentWindowHours?: number;
  }) {
    if (!input.clientId?.trim()) {
      throw new BadRequestException('clientId is required');
    }

    const sensors =
      input.sensors && input.sensors.length > 0
        ? input.sensors.map((sensor) => this.normalizeEnergySensor(sensor))
        : ['corrente', 'tensao', 'consumo'];

    const recentWindowHours = this.normalizeRecentWindowHours(
      input.recentWindowHours,
    );
    const recentSince = new Date(Date.now() - recentWindowHours * 60 * 60 * 1000);

    const devices = await this.prisma.device.findMany({
      where: { clientId: input.clientId },
      select: { id: true },
    } as any);
    const deviceIds = devices.map((device: any) => device.id as string);

    if (deviceIds.length === 0) {
      return {
        clientId: input.clientId,
        sensors,
        deviceCount: 0,
        devicesWithRecentReadings: 0,
        recentWindowHours,
        latestBySensor: [],
      };
    }

    const latestBySensor = await Promise.all(
      sensors.map(async (sensor) => {
        const latest = await this.prisma.sensorReading.findFirst({
          where: {
            deviceId: { in: deviceIds },
            sensorType: sensor,
          },
          orderBy: { createdAt: 'desc' },
        } as any);

        return {
          sensorType: sensor,
          value: latest?.value ?? null,
          unit: latest?.unit ?? null,
          deviceId: latest?.deviceId ?? null,
          createdAt: latest?.createdAt ?? null,
        };
      }),
    );

    const recentRows = await this.prisma.sensorReading.findMany({
      where: {
        deviceId: { in: deviceIds },
        sensorType: { in: sensors },
        createdAt: { gte: recentSince },
      },
      select: { deviceId: true },
      distinct: ['deviceId'],
    } as any);

    return {
      clientId: input.clientId,
      sensors,
      deviceCount: deviceIds.length,
      devicesWithRecentReadings: recentRows.length,
      recentWindowHours,
      latestBySensor,
    };
  }

  private normalizeEnergySensor(sensor: string) {
    const normalized = sensor.trim().toLowerCase();
    if (!ENERGY_SENSORS.has(normalized)) {
      throw new BadRequestException(
        `Invalid energy sensor. Allowed: ${Array.from(ENERGY_SENSORS).join(', ')}`,
      );
    }
    return normalized;
  }

  private normalizeRecentWindowHours(value?: number) {
    if (!Number.isFinite(value)) return 24;
    return Math.max(1, Math.min(168, Number(value)));
  }
}
