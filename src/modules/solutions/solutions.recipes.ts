export type SolutionRecipeItem = {
  moduleKey: 'ambiental' | 'acionamento' | 'energia';
  itemKey: string;
  required: boolean;
};

export type SolutionRecipe = {
  key: string;
  name: string;
  version: string;
  description: string;
  items: SolutionRecipeItem[];
  operationalGuidance: string[];
};

export const SOLUTION_RECIPES: SolutionRecipe[] = [
  {
    key: 'cadeia_fria',
    name: 'Controle Inteligente de Camaras Frias',
    version: 'v1',
    description:
      'Pacote comercial para monitoramento proativo de camaras frias com foco em seguranca operacional e eficiencia energetica.',
    items: [
      { moduleKey: 'ambiental', itemKey: 'temperatura', required: true },
      { moduleKey: 'ambiental', itemKey: 'umidade', required: true },
      { moduleKey: 'ambiental', itemKey: 'gases', required: true },
      { moduleKey: 'acionamento', itemKey: 'rele', required: false },
      { moduleKey: 'energia', itemKey: 'consumo', required: false },
    ],
    operationalGuidance: [
      'Configurar regra critica de gases para alerta imediato.',
      'Configurar regra de temperatura com cooldown operacional.',
      'Validar fluxo de notificacao API -> n8n -> Evolution -> WhatsApp.',
    ],
  },
];

export function findSolutionRecipe(key: string, version?: string) {
  const normalizedKey = key.trim().toLowerCase();
  const normalizedVersion = version?.trim().toLowerCase();

  return SOLUTION_RECIPES.find((recipe) => {
    if (recipe.key.toLowerCase() !== normalizedKey) return false;
    if (!normalizedVersion) return true;
    return recipe.version.toLowerCase() === normalizedVersion;
  });
}
