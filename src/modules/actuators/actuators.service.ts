import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActuatorDto } from './dto/create-actuator.dto';
import { UpdateActuatorDto } from './dto/update-actuator.dto';
import { CreateActuationCommandDto } from './dto/create-actuation-command.dto';
import { AckActuationDto } from './dto/ack-actuation.dto';

@Injectable()
export class ActuatorsService {
  private readonly actuationNotifyCooldownByKey = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateActuatorDto) {
    await this.ensureClientExists(dto.clientId);
    await this.ensureDeviceBelongsToClient(dto.deviceId, dto.clientId);

    return this.prisma.actuator.create({
      data: {
        id: dto.id,
        clientId: dto.clientId,
        deviceId: dto.deviceId,
        name: dto.name,
        location: dto.location,
        currentState: 'off',
      } as any,
    });
  }

  async list(filters: { clientId?: string; deviceId?: string; state?: string }) {
    const where: any = {};
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.deviceId) where.deviceId = filters.deviceId;
    if (filters.state) where.currentState = filters.state;

    return this.prisma.actuator.findMany({
      where,
      orderBy: { id: 'asc' },
    } as any);
  }

  async listForRuntime(deviceId: string) {
    const rows = await this.prisma.actuator.findMany({
      where: { deviceId },
      orderBy: { id: 'asc' },
    } as any);

    return rows.map((row: any) => ({
      id: row.id,
      deviceId: row.deviceId ?? null,
      name: row.name,
      currentState: row.currentState,
      lastCommandAt: row.lastCommandAt ?? null,
      lastCommandBy: row.lastCommandBy ?? null,
    }));
  }

  async findOne(id: string, clientId?: string) {
    const actuator = await this.prisma.actuator.findUnique({ where: { id } } as any);
    if (!actuator) throw new NotFoundException('Actuator not found');
    if (clientId && (actuator as any).clientId !== clientId) {
      throw new NotFoundException('Actuator not found for client');
    }
    return actuator;
  }

  async update(id: string, dto: UpdateActuatorDto, clientId?: string) {
    const existing = await this.findOne(id, clientId);
    const nextClientId = clientId ?? dto.clientId ?? (existing as any).clientId;
    const nextDeviceId =
      dto.deviceId === undefined ? (existing as any).deviceId : dto.deviceId;

    await this.ensureClientExists(nextClientId);
    await this.ensureDeviceBelongsToClient(nextDeviceId ?? undefined, nextClientId);

    return this.prisma.actuator.update({
      where: { id },
      data: {
        clientId: nextClientId,
        deviceId: nextDeviceId,
        name: dto.name,
        location: dto.location,
      } as any,
    });
  }

  async remove(id: string, clientId?: string) {
    await this.findOne(id, clientId);
    return this.prisma.actuator.delete({ where: { id } } as any);
  }

  async listCommands(actuatorId: string, limit = 20, clientId?: string) {
    await this.findOne(actuatorId, clientId);
    const safeLimit = Math.max(1, Math.min(Number.isFinite(limit) ? limit : 20, 100));

    return this.prisma.actuationCommand.findMany({
      where: { actuatorId },
      orderBy: { executedAt: 'desc' },
      take: safeLimit,
    } as any);
  }

  async listRecentCommands(limit = 20, clientId?: string) {
    const safeLimit = Math.max(1, Math.min(Number.isFinite(limit) ? limit : 20, 100));
    const where = clientId ? ({ clientId } as any) : undefined;

    return this.prisma.actuationCommand.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      take: safeLimit,
      include: {
        actuator: true,
      },
    } as any);
  }

  async createCommand(
    actuatorId: string,
    dto: CreateActuationCommandDto,
    clientId?: string,
  ) {
    const actuator = await this.findOne(actuatorId, clientId);
    const now = new Date();

    const command = await this.prisma.actuationCommand.create({
      data: {
        actuatorId,
        clientId: (actuator as any).clientId,
        desiredState: dto.desiredState,
        source: dto.source,
        note: dto.note,
        executedAt: now,
      } as any,
    });

    await this.prisma.actuator.update({
      where: { id: actuatorId },
      data: {
        currentState: dto.desiredState,
        lastCommandAt: now,
        lastCommandBy: dto.source ?? 'manual',
      } as any,
    });

    await this.trySendActuationWebhook({
      actuator: actuator as any,
      command: command as any,
      desiredState: dto.desiredState,
      source: dto.source ?? 'manual',
      note: dto.note ?? null,
      executedAt: now,
    });

    return {
      ...(command as any),
      actuator: {
        ...(actuator as any),
        currentState: dto.desiredState,
        lastCommandAt: now,
        lastCommandBy: dto.source ?? 'manual',
      },
    };
  }

  async acknowledgeRuntimeState(actuatorId: string, dto: AckActuationDto) {
    const actuator = await this.findOne(actuatorId);
    const now = new Date();
    const source = dto.success === false ? 'device_ack_failed' : 'device_ack';
    const note = dto.message?.trim() || null;

    const command = await this.prisma.actuationCommand.create({
      data: {
        actuatorId,
        clientId: (actuator as any).clientId,
        desiredState: dto.appliedState,
        source,
        note,
        executedAt: now,
      } as any,
    });

    const updatedActuator = await this.prisma.actuator.update({
      where: { id: actuatorId },
      data: {
        currentState: dto.appliedState,
        lastCommandAt: now,
        lastCommandBy: source,
      } as any,
    });

    return {
      ok: true,
      success: dto.success ?? true,
      actuator: updatedActuator,
      command,
    };
  }

  private async ensureClientExists(clientId: string) {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } } as any);
    if (!client) throw new BadRequestException('clientId does not exist');
  }

  private async ensureDeviceBelongsToClient(
    deviceId: string | undefined,
    clientId: string,
  ) {
    if (!deviceId) return;
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
    if (!device || (device as any).clientId !== clientId) {
      throw new BadRequestException('deviceId does not belong to clientId');
    }
  }

  private async trySendActuationWebhook(params: {
    actuator: any;
    command: any;
    desiredState: 'on' | 'off';
    source: string;
    note: string | null;
    executedAt: Date;
  }) {
    const webhookUrl = process.env.N8N_ACTUATION_WEBHOOK_URL?.trim();
    if (!webhookUrl) return;

    const notificationsEnabled = this.parseBooleanEnv(
      process.env.ACTUATION_NOTIFY_ENABLED,
      false,
    );
    if (!notificationsEnabled) return;

    const source = params.source.trim().toLowerCase();
    if (!this.isNotifySourceAllowed(source)) return;

    const client = await this.prisma.client.findUnique({
      where: { id: params.actuator.clientId },
      select: {
        id: true,
        name: true,
        document: true,
        alertPhone: true,
        adminPhone: true,
        phone: true,
        actuationNotifyCooldownMinutes: true,
      },
    } as any);

    const fallbackCooldownSeconds = this.parsePositiveIntEnv(
      process.env.ACTUATION_NOTIFY_COOLDOWN_SECONDS,
      900,
    );
    const fallbackCooldownMinutes = Math.max(
      1,
      Math.ceil(fallbackCooldownSeconds / 60),
    );
    const cooldownMinutes = this.parsePositiveInt(
      client?.actuationNotifyCooldownMinutes,
      fallbackCooldownMinutes,
    );
    const cooldownSeconds = cooldownMinutes * 60;
    const cooldownKey = `${params.actuator.id}:${params.desiredState}`;
    const nowMs = params.executedAt.getTime();
    const nextAllowedAt = this.actuationNotifyCooldownByKey.get(cooldownKey) ?? 0;

    if (nextAllowedAt > nowMs) {
      return;
    }

    this.actuationNotifyCooldownByKey.set(
      cooldownKey,
      nowMs + cooldownSeconds * 1000,
    );

    const device = params.actuator.deviceId
      ? await this.prisma.device.findUnique({
          where: { id: params.actuator.deviceId },
          select: {
            id: true,
            name: true,
            location: true,
          },
        } as any)
      : null;

    const recipientPhone =
      client?.alertPhone ?? client?.adminPhone ?? client?.phone ?? null;
    const recipientSource = client?.alertPhone
      ? 'alert_phone'
      : client?.adminPhone
        ? 'admin_phone'
        : client?.phone
          ? 'client_phone'
          : null;

    const payload = {
      type: 'actuation_command',
      event_type_alias: 'actuation',
      client_id: client?.id ?? params.actuator.clientId ?? null,
      clientId: client?.id ?? params.actuator.clientId ?? null,
      client_name: client?.name ?? null,
      clientName: client?.name ?? null,
      client_document: client?.document ?? null,
      clientDocument: client?.document ?? null,
      actuator_id: params.actuator.id,
      actuatorId: params.actuator.id,
      actuator_name: params.actuator.name ?? null,
      actuatorName: params.actuator.name ?? null,
      actuator_location: params.actuator.location ?? null,
      actuatorLocation: params.actuator.location ?? null,
      device_id: params.actuator.deviceId ?? null,
      deviceId: params.actuator.deviceId ?? null,
      device_name: device?.name ?? null,
      deviceName: device?.name ?? null,
      device_location: device?.location ?? null,
      deviceLocation: device?.location ?? null,
      desired_state: params.desiredState,
      desiredState: params.desiredState,
      source: source,
      note: params.note,
      command_id: params.command.id ?? null,
      commandId: params.command.id ?? null,
      executed_at: params.executedAt.toISOString(),
      executedAt: params.executedAt.toISOString(),
      executed_at_local: this.toLocalDateTime(params.executedAt.toISOString()),
      executedAtLocal: this.toLocalDateTime(params.executedAt.toISOString()),
      recipient_phone: recipientPhone,
      recipientPhone,
      recipient_source: recipientSource,
      recipientSource,
      cooldown_minutes: cooldownMinutes,
      cooldownMinutes,
      cooldown_seconds: cooldownSeconds,
      cooldownSeconds,
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // O webhook de acionamento e opcional e nao deve quebrar o comando principal.
    }
  }

  private isNotifySourceAllowed(source: string) {
    const raw = process.env.ACTUATION_NOTIFY_SOURCES?.trim();
    if (!raw) {
      // Modo seguro por padrao: apenas comando manual do dashboard.
      return source === 'dashboard';
    }

    const allowed = raw
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    return allowed.includes(source);
  }

  private parsePositiveIntEnv(rawValue: string | undefined, fallback: number) {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.floor(parsed);
  }

  private parsePositiveInt(rawValue: unknown, fallback: number) {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.floor(parsed);
  }

  private parseBooleanEnv(rawValue: string | undefined, fallback: boolean) {
    if (rawValue == null) return fallback;
    const normalized = rawValue.trim().toLowerCase();

    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;

    return fallback;
  }

  private toLocalDateTime(value: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
