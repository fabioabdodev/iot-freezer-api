import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../infra/cache/cache.service';

@Injectable()
export class ReadingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async listByDevice(
    deviceId: string,
    clientId?: string,
    sensorType = 'temperature',
    limit = 100,
    resolution?: string,
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

    const cacheKey = `readings:${deviceId}:${clientId ?? 'all'}:${sensorType}:${safeLimit}:${resolution ?? 'raw'}`;
    const cached = this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const rows = await this.prisma.temperatureLog.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    });

    const normalized = rows
      .slice()
      .reverse()
      .map((row) => ({
        deviceId: row.deviceId,
        sensorType: 'temperature',
        value: row.temperature,
        createdAt: row.createdAt,
      }));

    const payload = resolution
      ? this.aggregateByResolution(normalized, resolution)
      : normalized;

    this.cache.set(
      cacheKey,
      payload,
      this.configService.get<number>('CACHE_TTL_SECONDS') ?? 15,
    );
    return payload;
  }

  private aggregateByResolution(
    rows: Array<{
      deviceId: string;
      sensorType: string;
      value: number;
      createdAt: Date;
    }>,
    resolution: string,
  ) {
    const bucketMs = this.getResolutionMs(resolution);
    if (!bucketMs) return rows;

    const buckets = new Map<
      number,
      {
        deviceId: string;
        sensorType: string;
        sum: number;
        count: number;
        min: number;
        max: number;
      }
    >();

    for (const row of rows) {
      const ts = row.createdAt.getTime();
      const bucketStart = Math.floor(ts / bucketMs) * bucketMs;
      const current = buckets.get(bucketStart);
      if (!current) {
        buckets.set(bucketStart, {
          deviceId: row.deviceId,
          sensorType: row.sensorType,
          sum: row.value,
          count: 1,
          min: row.value,
          max: row.value,
        });
      } else {
        current.sum += row.value;
        current.count += 1;
        current.min = Math.min(current.min, row.value);
        current.max = Math.max(current.max, row.value);
      }
    }

    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([bucketStart, bucket]) => ({
        deviceId: bucket.deviceId,
        sensorType: bucket.sensorType,
        value: Number((bucket.sum / bucket.count).toFixed(3)),
        createdAt: new Date(bucketStart),
        count: bucket.count,
        minValue: bucket.min,
        maxValue: bucket.max,
      }));
  }

  private getResolutionMs(resolution: string) {
    if (resolution === '5m') return 5 * 60 * 1000;
    if (resolution === '15m') return 15 * 60 * 1000;
    if (resolution === '1h') return 60 * 60 * 1000;
    if (resolution === '1d') return 24 * 60 * 60 * 1000;
    return null;
  }
}
