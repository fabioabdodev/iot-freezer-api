export type SolutionRecipeItem = {
  moduleKey: 'ambiental' | 'acionamento' | 'energia';
  itemKey: string;
  required: boolean;
};

export type SolutionCatalogEntry = {
  key: string;
  name: string;
  version: string;
  description: string;
  requiredItems: SolutionRecipeItem[];
  recommendedItems: SolutionRecipeItem[];
  operationalGuidance: string[];
};

export type SolutionReadinessEntry = {
  key: string;
  name: string;
  version: string;
  description: string;
  ready: boolean;
  required: {
    total: number;
    enabled: number;
    missingItems: SolutionRecipeItem[];
  };
  recommended: {
    total: number;
    enabled: number;
  };
  operationalGuidance: string[];
};

export type ApplySolutionInput = {
  clientId: string;
  solutionKey: string;
  version?: string;
  includeRecommended?: boolean;
};

export type ApplySolutionResult = {
  message: string;
  clientId: string;
  solutionKey: string;
  version: string;
  appliedItemKeys: string[];
  includeRecommended: boolean;
};
