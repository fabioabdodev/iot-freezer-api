import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditTrailService } from '../../infra/audit/audit-trail.service';
import { CreateActuationScheduleDto } from './dto/create-actuation-schedule.dto';
import { UpdateActuationScheduleDto } from './dto/update-actuation-schedule.dto';
import type { SessionUser } from '../auth/auth.types';

const WEEKDAY_MAP: Record<string, string> = {
  Sun: 'sun',
  Mon: 'mon',
  Tue: 'tue',
  Wed: 'wed',
  Thu: 'thu',
  Fri: 'fri',
  Sat: 'sat',
};

@Injectable()
export class ActuationSchedulesService {
  private readonly logger = new Logger(ActuationSchedulesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditTrail: AuditTrailService,
  ) {}

  async create(dto: CreateActuationScheduleDto, actor?: SessionUser) {
    this.validateWindow(dto.startMinutes, dto.endMinutes);
    await this.ensureClientExists(dto.clientId);
    const actuator = await this.ensureActuatorBelongsToClient(dto.actuatorId, dto.clientId);

    const created = await this.prisma.actuationSchedule.create({
      data: {
        clientId: dto.clientId,
        actuatorId: actuator.id,
        name: dto.name,
        weekdays: dto.weekdays,
        startMinutes: dto.startMinutes,
        endMinutes: dto.endMinutes,
        timezone: dto.timezone ?? 'America/Sao_Paulo',
        enabled: dto.enabled ?? true,
      } as any,
    });

    await this.auditTrail.record({
      clientId: created.clientId,
      entityType: 'actuation_schedule',
      entityId: created.id,
      action: 'actuation_schedule_created',
      nextValue: created as any,
      actor,
    });

    return created;
  }

  async list(filters: {
    clientId?: string;
    actuatorId?: string;
    enabled?: boolean;
  }) {
    const where: any = {};
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.actuatorId) where.actuatorId = filters.actuatorId;
    if (typeof filters.enabled === 'boolean') where.enabled = filters.enabled;

    return this.prisma.actuationSchedule.findMany({
      where,
      orderBy: [{ actuatorId: 'asc' }, { startMinutes: 'asc' }],
    } as any);
  }

  async findOne(id: string, clientId?: string) {
    const schedule = await this.prisma.actuationSchedule.findUnique({
      where: { id },
    } as any);
    if (!schedule) throw new NotFoundException('Actuation schedule not found');
    if (clientId && (schedule as any).clientId !== clientId) {
      throw new NotFoundException('Actuation schedule not found for client');
    }
    return schedule;
  }

  async update(
    id: string,
    dto: UpdateActuationScheduleDto,
    clientId?: string,
    actor?: SessionUser,
  ) {
    const existing = await this.findOne(id, clientId);
    const nextClientId = clientId ?? dto.clientId ?? (existing as any).clientId;
    const nextActuatorId = dto.actuatorId ?? (existing as any).actuatorId;
    const nextStart = dto.startMinutes ?? (existing as any).startMinutes;
    const nextEnd = dto.endMinutes ?? (existing as any).endMinutes;

    this.validateWindow(nextStart, nextEnd);
    await this.ensureClientExists(nextClientId);
    await this.ensureActuatorBelongsToClient(nextActuatorId, nextClientId);

    const updated = await this.prisma.actuationSchedule.update({
      where: { id },
      data: {
        clientId: nextClientId,
        actuatorId: nextActuatorId,
        name: dto.name,
        weekdays: dto.weekdays,
        startMinutes: dto.startMinutes,
        endMinutes: dto.endMinutes,
        timezone: dto.timezone,
        enabled: dto.enabled,
      } as any,
    });

    await this.auditTrail.record({
      clientId: updated.clientId,
      entityType: 'actuation_schedule',
      entityId: updated.id,
      action: 'actuation_schedule_updated',
      previousValue: existing as any,
      nextValue: updated as any,
      actor,
    });

    return updated;
  }

  async remove(id: string, clientId?: string, actor?: SessionUser) {
    const existing = await this.findOne(id, clientId);
    const deleted = await this.prisma.actuationSchedule.delete({
      where: { id },
    } as any);

    await this.auditTrail.record({
      clientId: existing.clientId,
      entityType: 'actuation_schedule',
      entityId: existing.id,
      action: 'actuation_schedule_deleted',
      previousValue: existing as any,
      actor,
    });

    return deleted;
  }

  @Cron('0 * * * * *')
  async processSchedules() {
    const schedules = await this.prisma.actuationSchedule.findMany({
      where: { enabled: true },
      include: {
        actuator: true,
      },
    } as any);

    if (schedules.length === 0) return;

    const grouped = new Map<string, any[]>();
    for (const schedule of schedules) {
      const key = schedule.actuatorId;
      const current = grouped.get(key) ?? [];
      current.push(schedule);
      grouped.set(key, current);
    }

    const now = new Date();

    for (const [actuatorId, actuatorSchedules] of grouped.entries()) {
      const actuator = actuatorSchedules[0]?.actuator;
      if (!actuator) continue;

      const activeSchedules = actuatorSchedules.filter((schedule) =>
        this.isScheduleActive(schedule, now),
      );
      const desiredState = activeSchedules.length > 0 ? 'on' : 'off';

      if (actuator.currentState === desiredState) continue;

      const note =
        activeSchedules.length > 0
          ? `rotina ativa: ${activeSchedules.map((schedule) => schedule.name).join(', ')}`
          : 'fora da janela das rotinas ativas';

      await this.prisma.actuationCommand.create({
        data: {
          actuatorId,
          clientId: actuator.clientId,
          desiredState,
          source: 'schedule',
          note,
          executedAt: now,
        } as any,
      });

      await this.prisma.actuator.update({
        where: { id: actuatorId },
        data: {
          currentState: desiredState,
          lastCommandAt: now,
          lastCommandBy: 'schedule',
        } as any,
      });

      this.logger.log(
        `Applied scheduled state actuator=${actuatorId} state=${desiredState} activeSchedules=${activeSchedules.length}`,
      );
    }
  }

  private isScheduleActive(schedule: any, now: Date) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: schedule.timezone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const weekday = WEEKDAY_MAP[parts.find((part) => part.type === 'weekday')?.value ?? ''];
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
    const minutes = hour * 60 + minute;

    if (!weekday || !schedule.weekdays.includes(weekday)) {
      return false;
    }

    return minutes >= schedule.startMinutes && minutes < schedule.endMinutes;
  }

  private validateWindow(startMinutes: number, endMinutes: number) {
    if (startMinutes >= endMinutes) {
      throw new BadRequestException(
        'startMinutes must be less than endMinutes',
      );
    }
  }

  private async ensureClientExists(clientId: string) {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } } as any);
    if (!client) throw new BadRequestException('clientId does not exist');
  }

  private async ensureActuatorBelongsToClient(actuatorId: string, clientId: string) {
    const actuator = await this.prisma.actuator.findUnique({ where: { id: actuatorId } } as any);
    if (!actuator || (actuator as any).clientId !== clientId) {
      throw new BadRequestException('actuatorId does not belong to clientId');
    }
    return actuator as any;
  }
}
