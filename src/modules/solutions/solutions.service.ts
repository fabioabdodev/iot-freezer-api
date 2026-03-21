import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplySolutionDto } from './dto/apply-solution.dto';
import { findSolutionRecipe, SOLUTION_RECIPES } from './solutions.recipes';

@Injectable()
export class SolutionsService {
  constructor(private readonly prisma: PrismaService) {}

  listCatalog() {
    return SOLUTION_RECIPES.map((recipe) => ({
      key: recipe.key,
      name: recipe.name,
      version: recipe.version,
      description: recipe.description,
      requiredItems: recipe.items.filter((item) => item.required),
      recommendedItems: recipe.items.filter((item) => !item.required),
      operationalGuidance: recipe.operationalGuidance,
    }));
  }

  async listByClient(clientId: string) {
    await this.ensureClientExists(clientId);

    const accesses = await this.prisma.clientModuleItem.findMany({
      where: {
        clientId,
        enabled: true,
      },
      orderBy: {
        itemKey: 'asc',
      },
    } as any);

    const enabledItemKeys = new Set(accesses.map((row: any) => row.itemKey as string));

    return SOLUTION_RECIPES.map((recipe) => {
      const requiredItems = recipe.items.filter((item) => item.required);
      const recommendedItems = recipe.items.filter((item) => !item.required);

      const requiredEnabled = requiredItems.filter((item) =>
        enabledItemKeys.has(item.itemKey),
      );
      const recommendedEnabled = recommendedItems.filter((item) =>
        enabledItemKeys.has(item.itemKey),
      );

      const missingRequiredItems = requiredItems.filter(
        (item) => !enabledItemKeys.has(item.itemKey),
      );

      return {
        key: recipe.key,
        name: recipe.name,
        version: recipe.version,
        description: recipe.description,
        ready: missingRequiredItems.length === 0,
        required: {
          total: requiredItems.length,
          enabled: requiredEnabled.length,
          missingItems: missingRequiredItems,
        },
        recommended: {
          total: recommendedItems.length,
          enabled: recommendedEnabled.length,
        },
        operationalGuidance: recipe.operationalGuidance,
      };
    });
  }

  async applySolution(dto: ApplySolutionDto) {
    await this.ensureClientExists(dto.clientId);

    const recipe = findSolutionRecipe(dto.solutionKey, dto.version);
    if (!recipe) {
      throw new BadRequestException('solutionKey/version is not supported');
    }

    const includeRecommended = dto.includeRecommended ?? true;
    const targetItems = recipe.items.filter(
      (item) => item.required || includeRecommended,
    );

    const catalogRows = await this.prisma.moduleCatalogItem.findMany({
      where: {
        key: {
          in: targetItems.map((item) => item.itemKey),
        },
      },
      select: {
        key: true,
        moduleKey: true,
      },
    } as any);

    const catalogMap = new Map(
      catalogRows.map((row: any) => [row.key as string, row.moduleKey as string]),
    );

    for (const item of targetItems) {
      const moduleKey = catalogMap.get(item.itemKey);
      if (!moduleKey) {
        throw new BadRequestException(
          `itemKey ${item.itemKey} is missing in module catalog`,
        );
      }
      if (moduleKey !== item.moduleKey) {
        throw new BadRequestException(
          `itemKey ${item.itemKey} does not belong to module ${item.moduleKey}`,
        );
      }
    }

    await Promise.all(
      targetItems.map((item) =>
        this.prisma.clientModuleItem.upsert({
          where: {
            clientId_itemKey: {
              clientId: dto.clientId,
              itemKey: item.itemKey,
            },
          },
          update: {
            enabled: true,
          },
          create: {
            clientId: dto.clientId,
            itemKey: item.itemKey,
            enabled: true,
          },
        } as any),
      ),
    );

    return {
      message: 'Solucao aplicada com sucesso.',
      clientId: dto.clientId,
      solutionKey: recipe.key,
      version: recipe.version,
      appliedItemKeys: targetItems.map((item) => item.itemKey),
      includeRecommended,
    };
  }

  private async ensureClientExists(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    } as any);

    if (!client) {
      throw new BadRequestException('clientId does not exist');
    }
  }
}
