import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: {
    clientId?: string;
    entityType?: string;
    entityId?: string;
    limit?: number;
  }) {
    const safeLimit = Math.max(
      1,
      Math.min(Number.isFinite(filters.limit) ? Number(filters.limit) : 20, 100),
    );

    const where: any = {};
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    } as any);
  }
}
