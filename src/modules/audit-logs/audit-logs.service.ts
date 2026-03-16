import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: {
    clientId?: string;
    entityType?: string;
    entityId?: string;
    from?: string;
    to?: string;
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
    if (filters.from || filters.to) {
      where.createdAt = {};

      if (filters.from) {
        const fromDate = new Date(filters.from);
        if (!Number.isNaN(fromDate.getTime())) {
          where.createdAt.gte = fromDate;
        }
      }

      if (filters.to) {
        const toDate = new Date(filters.to);
        if (!Number.isNaN(toDate.getTime())) {
          where.createdAt.lte = toDate;
        }
      }

      if (Object.keys(where.createdAt).length === 0) {
        delete where.createdAt;
      }
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
    } as any);
  }
}
