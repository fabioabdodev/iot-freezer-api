import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertClientModuleDto } from './dto/upsert-client-module.dto';

const SUPPORTED_MODULES = [
  {
    key: 'temperature',
    name: 'Temperatura',
    description: 'Monitoramento, historico e alertas de temperatura.',
  },
  {
    key: 'actuation',
    name: 'Acionamento',
    description: 'Controle manual de cargas e historico de comandos.',
  },
] as const;

@Injectable()
export class ClientModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(clientId: string) {
    await this.ensureClientExists(clientId);

    const rows = await this.prisma.clientModule.findMany({
      where: { clientId },
      orderBy: { moduleKey: 'asc' },
    } as any);

    const byKey = new Map(rows.map((row: any) => [row.moduleKey, row]));

    return SUPPORTED_MODULES.map((module) => {
      const existing = byKey.get(module.key);
      return {
        id: existing?.id ?? `${clientId}:${module.key}`,
        clientId,
        moduleKey: module.key,
        name: module.name,
        description: module.description,
        enabled: existing?.enabled ?? false,
        createdAt: existing?.createdAt ?? null,
        updatedAt: existing?.updatedAt ?? null,
      };
    });
  }

  async upsert(dto: UpsertClientModuleDto) {
    await this.ensureClientExists(dto.clientId);

    const row = await this.prisma.clientModule.upsert({
      where: {
        clientId_moduleKey: {
          clientId: dto.clientId,
          moduleKey: dto.moduleKey,
        },
      },
      update: {
        enabled: dto.enabled,
      },
      create: {
        clientId: dto.clientId,
        moduleKey: dto.moduleKey,
        enabled: dto.enabled,
      },
    } as any);

    return {
      id: row.id,
      clientId: row.clientId,
      moduleKey: row.moduleKey,
      name: SUPPORTED_MODULES.find((module) => module.key === row.moduleKey)?.name ?? row.moduleKey,
      description:
        SUPPORTED_MODULES.find((module) => module.key === row.moduleKey)?.description ?? '',
      enabled: row.enabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private async ensureClientExists(clientId: string) {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      throw new BadRequestException('clientId does not exist');
    }
  }
}
