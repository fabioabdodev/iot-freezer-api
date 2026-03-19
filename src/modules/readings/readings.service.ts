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
    const normalizedSensorType = sensorType.trim().toLowerCase() || 'temperature';

    const cacheKey = `readings:${deviceId}:${clientId ?? 'all'}:${normalizedSensorType}:${safeLimit}:${resolution ?? 'raw'}`;
    const cached = this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const sensorRows = await this.prisma.sensorReading.findMany({
      where: {
        deviceId,
        sensorType: normalizedSensorType,
      },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    } as any);

    let normalized = sensorRows
      .slice()
      .reverse()
      .map((row: any) => ({
        deviceId: row.deviceId,
        sensorType: row.sensorType,
        value: row.value,
        unit: row.unit ?? null,
        createdAt: row.createdAt,
      }));

    if (normalized.length === 0 && normalizedSensorType === 'temperature') {
      const temperatureRows = await this.prisma.temperatureLog.findMany({
        where: { deviceId },
        orderBy: { createdAt: 'desc' },
        take: safeLimit,
      });

      normalized = temperatureRows
        .slice()
        .reverse()
        .map((row) => ({
          deviceId: row.deviceId,
          sensorType: 'temperature',
          value: row.temperature,
          unit: 'celsius',
          createdAt: row.createdAt,
        }));
    }

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
      unit?: string | null;
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
        unit?: string | null;
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
          unit: row.unit ?? null,
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
        unit: bucket.unit ?? null,
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
