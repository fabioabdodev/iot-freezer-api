import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MonitorService {
  private readonly logger = new Logger(MonitorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('*/1 * * * *')
  async checkOfflineDevices() {
    this.logger.log('cron rodou');

    const minutesOffline =
      this.configService.get<number>('DEVICE_OFFLINE_MINUTES') ?? 5;
    const temperatureCooldownMinutes =
      this.configService.get<number>('TEMPERATURE_ALERT_COOLDOWN_MINUTES') ?? 5;

    const cutoff = new Date(Date.now() - minutesOffline * 60 * 1000);

    // Buscar devices que passaram do cutoff e ainda não foram marcados como offline
    const offlineCandidates = await this.prisma.device.findMany({
      where: {
        AND: [
          { isOffline: false },
          {
            OR: [{ lastSeen: null }, { lastSeen: { lt: cutoff } }],
          },
        ],
      },
    });

    const allDevices = await this.prisma.device.findMany({
      orderBy: { id: 'asc' },
    });

    this.logger.log(
      `devices: ${allDevices
        .map(
          (d) =>
            `${d.id} lastSeen=${d.lastSeen ? d.lastSeen.toISOString() : 'null'} isOffline=${d.isOffline}`,
        )
        .join(' | ')}`,
    );

    this.logger.log(`cutoff=${cutoff.toISOString()}`);
    this.logger.log(`offlineCandidates=${offlineCandidates.length}`);

    // Para cada device offline, marcar como offline e alertar (apenas 1x por transição)
    for (const device of offlineCandidates) {
      await this.prisma.device.update({
        where: { id: device.id },
        data: {
          isOffline: true,
          offlineSince: new Date(),
          lastAlertAt: new Date(),
        },
      });

      this.logger.warn(`Device ${device.id} ficou OFFLINE!`);

      // TODO: implementar webhook n8n quando N8N_OFFLINE_WEBHOOK_URL estiver configurado
    }

    // Verificar limites de temperatura dos dispositivos configurados
    const devicesWithLimits = await this.prisma.device.findMany({
      where: {
        OR: [
          { minTemperature: { not: null } },
          { maxTemperature: { not: null } },
        ],
      },
    } as any);

    for (const device of devicesWithLimits) {
      const lastLog = await this.prisma.temperatureLog.findFirst({
        where: { deviceId: device.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastLog) continue;

      const temp = lastLog.temperature;
      const dev: any = device;

      const below =
        dev.minTemperature != null && temp < dev.minTemperature;
      const above =
        dev.maxTemperature != null && temp > dev.maxTemperature;

      if (below || above) {
        // evitar spam: só enviar alerta se não foi disparado recentemente
        const now = new Date();
        const cooldownMs = temperatureCooldownMinutes * 60 * 1000;
        const lastAlert = device.lastAlertAt?.getTime() ?? 0;

        if (now.getTime() - lastAlert > cooldownMs) {
          await this.prisma.device.update({
            where: { id: device.id },
            data: { lastAlertAt: now },
          });

          this.logger.warn(
            `Device ${device.id} temperatura fora do limite: ${temp} (limites ${dev.minTemperature}-${dev.maxTemperature})`,
          );

          await this.sendTemperatureAlert({
            deviceId: device.id,
            temperature: temp,
            minTemperature: dev.minTemperature ?? null,
            maxTemperature: dev.maxTemperature ?? null,
            occurredAt: now.toISOString(),
          });
        }
      }
    }
  }

  private async sendTemperatureAlert(payload: {
    deviceId: string;
    temperature: number;
    minTemperature: number | null;
    maxTemperature: number | null;
    occurredAt: string;
  }) {
    const webhookUrl = this.configService.get<string>(
      'N8N_TEMPERATURE_ALERT_WEBHOOK_URL',
    );

    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'temperature_out_of_range',
          device_id: payload.deviceId,
          temperature: payload.temperature,
          min_temperature: payload.minTemperature,
          max_temperature: payload.maxTemperature,
          occurred_at: payload.occurredAt,
        }),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar alerta de temperatura para device ${payload.deviceId}`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
