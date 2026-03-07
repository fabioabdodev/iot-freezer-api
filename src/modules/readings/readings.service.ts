import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReadingsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByDevice(
    deviceId: string,
    clientId?: string,
    sensorType = 'temperature',
    limit = 100,
  ) {
    if (clientId) {
      const device = await this.prisma.device.findUnique({
        where: { id: deviceId },
      });
      if (!device || (device as any).clientId !== clientId) {
        throw new NotFoundException('Device not found for client');
      }
    }

    const normalizedLimit = Number.isFinite(limit) ? limit : 100;
    const safeLimit = Math.max(1, Math.min(normalizedLimit, 500));

    if (sensorType !== 'temperature') {
      return [];
    }

    const rows = await this.prisma.temperatureLog.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    });

    return rows
      .slice()
      .reverse()
      .map((row) => ({
        deviceId: row.deviceId,
        sensorType: 'temperature',
        value: row.temperature,
        createdAt: row.createdAt,
      }));
  }
}
