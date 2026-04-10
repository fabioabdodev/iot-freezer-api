import {
  Gauge,
  type LucideIcon,
  Power,
  Thermometer,
  Waves,
} from 'lucide-react';

export type Product = {
  slug: string;
  title: string;
  shortLabel: string;
  category: string;
  subtitle: string;
  summary: string;
  cardDescription: string;
  image: string;
  icon: LucideIcon;
  bullets: string[];
  deliverables: string[];
  segments: string[];
  detailIntro: string;
};

export const products: Product[] = [
  {
    slug: 'temperatura',
    title: 'Temperatura',
    shortLabel: 'Monitoramento',
    category: 'Ambiental',
    subtitle:
      'Monitoramento de equipamentos refrigerados com historico e alertas',
    summary:
      'Proteja o que nao pode sair da faixa ideal com historico, alertas e acompanhamento continuo.',
    cardDescription:
      'Ideal para freezers, geladeiras e pontos refrigerados criticos que exigem resposta rapida.',
    image:
      'url(https://images.pexels.com/photos/17630214/pexels-photo-17630214.jpeg?auto=compress&cs=tinysrgb&w=1200)',
    icon: Thermometer,
    bullets: [
      'Alertas objetivos no momento certo',
      'Historico claro por equipamento',
      'Mais seguranca para operacao e equipe',
    ],
    deliverables: [
      'Monitoramento continuo de temperatura',
      'Historico de leituras por equipamento',
      'Alerta de desvio de faixa',
      'Alerta de equipamento offline',
      'Painel de acompanhamento',
    ],
    segments: [
      'Restaurantes',
      'Clinicas pequenas',
      'Laboratorios pequenos',
      'Operacoes com refrigeracao critica',
    ],
    detailIntro:
      'O modulo Temperatura e a principal porta de entrada comercial da Virtuagil para operacoes que nao podem descobrir tarde demais que houve uma falha.',
  },
  {
    slug: 'acionamento',
    title: 'Acionamento',
    shortLabel: 'Operacao',
    category: 'Resposta operacional',
    subtitle: 'Controle operacional por etapas com mais rastreabilidade',
    summary:
      'Comandos e rotinas para agir com rapidez, menos improviso e mais controle do que foi feito.',
    cardDescription:
      'Um modulo para padronizar resposta operacional e reduzir dependencia de memoria ou improviso.',
    image:
      'url(https://images.pexels.com/photos/7662853/pexels-photo-7662853.jpeg?auto=compress&cs=tinysrgb&w=1200)',
    icon: Power,
    bullets: [
      'Acionamentos registrados',
      'Mais padrao na rotina',
      'Valor percebido maior',
    ],
    deliverables: [
      'Controle de acionamentos',
      'Registro de comandos executados',
      'Rotinas operacionais mais firmes',
      'Mais clareza sobre quem fez o que',
      'Base para automacoes futuras',
    ],
    segments: [
      'Operacoes comerciais',
      'Reservatorios e bombas',
      'Utilidades',
      'Processos com resposta operacional recorrente',
    ],
    detailIntro:
      'O modulo Acionamento amplia a capacidade da operacao de agir rapido e com mais previsibilidade, transformando rotina em processo controlado.',
  },
  {
    slug: 'consumo',
    title: 'Consumo',
    shortLabel: 'Energia',
    category: 'Camada premium',
    subtitle: 'Mais visibilidade para consumo, anomalias e eficiencia',
    summary:
      'Leitura eletrica para enxergar desperdicios, prever manutencao e apoiar decisoes com mais clareza.',
    cardDescription:
      'Uma camada premium para operacoes que precisam entender melhor corrente, tensao e consumo.',
    image:
      'url(https://images.pexels.com/photos/11924298/pexels-photo-11924298.jpeg?auto=compress&cs=tinysrgb&w=1200)',
    icon: Gauge,
    bullets: [
      'Corrente, tensao e consumo',
      'Diagnostico mais profundo',
      'Mais previsibilidade',
    ],
    deliverables: [
      'Monitoramento de consumo',
      'Leitura de corrente e tensao',
      'Mais visibilidade sobre anomalias',
      'Base para eficiencia energetica',
      'Apoio a manutencao e decisao',
    ],
    segments: [
      'Operacoes com alto custo energetico',
      'Empresas com manutencao recorrente',
      'Negocios com foco em eficiencia',
      'Clientes que buscam gestao mais profunda',
    ],
    detailIntro:
      'O modulo Consumo entra como expansao natural para clientes que ja querem ir alem do monitoramento basico e buscar leitura mais gerencial da operacao.',
  },
  {
    slug: 'gases',
    title: 'Gases',
    shortLabel: 'Ambiente',
    category: 'Expansao ambiental',
    subtitle: 'Monitoramento de ambiente e utilidades com mais previsibilidade',
    summary:
      'Monitore ambiente e utilidades com uma camada extra de visibilidade para operacoes sensiveis.',
    cardDescription:
      'Ajuda a acompanhar variacoes importantes em ambientes que exigem mais atencao com risco e estabilidade.',
    image:
      'url(https://images.pexels.com/photos/29102280/pexels-photo-29102280.jpeg?auto=compress&cs=tinysrgb&w=1200)',
    icon: Waves,
    bullets: [
      'Mais visibilidade operacional',
      'Sinais de risco mais cedo',
      'Monitoramento simples de ambiente',
    ],
    deliverables: [
      'Leitura ambiental complementar',
      'Mais previsibilidade para utilidades',
      'Sinais antecipados de variacao',
      'Melhor apoio a ambientes sensiveis',
      'Expansao natural do modulo ambiental',
    ],
    segments: [
      'Ambientes sensiveis',
      'Operacoes com utilidades criticas',
      'Clinicas e laboratorios',
      'Negocios que precisam ampliar monitoramento ambiental',
    ],
    detailIntro:
      'O modulo Gases expande a capacidade ambiental da Virtuagil para operacoes que precisam acompanhar mais do que temperatura e ganhar sinais antecipados de risco.',
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
