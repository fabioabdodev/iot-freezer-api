'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeDollarSign,
  Bot,
  Building2,
  ChevronRight,
  Gauge,
  MessageCircleMore,
  Power,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroIllustration } from '@/components/site/hero-illustration';

const modules = [
  {
    title: 'Ambiental',
    icon: Thermometer,
    subtitle: 'Monitoramento de temperatura',
    text: 'Porta de entrada comercial para operacoes que precisam acompanhar faixa ideal, offline e historico.',
    bullets: [
      'Alertas objetivos',
      'Historico por equipamento',
      'Leitura facil para cliente final',
    ],
  },
  {
    title: 'Acionamento',
    icon: Power,
    subtitle: 'Resposta operacional',
    text: 'Liga, desliga e automatiza rotinas quando a operacao precisa agir com menos improviso.',
    bullets: [
      'Comandos com rastreabilidade',
      'Rotinas mais firmes',
      'Mais valor percebido',
    ],
    featured: true,
  },
  {
    title: 'Energia',
    icon: Gauge,
    subtitle: 'Diagnostico eletrico',
    text: 'Adiciona corrente, tensao e consumo para ampliar previsibilidade e manutencao.',
    bullets: [
      'Camada premium',
      'Leitura eletrica',
      'Mais profundidade comercial',
    ],
  },
];

const offers = [
  {
    title: 'Venda por modulo',
    text: 'Voce nao precisa vender um projeto gigante logo na primeira conversa. A Virtuagil entra pela dor principal.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Explicacao simples',
    text: 'O cliente precisa entender rapido o valor da proposta, sem sentir que entrou em um dashboard tecnico.',
    icon: MessageCircleMore,
  },
  {
    title: 'Confianca operacional',
    text: 'A proposta comercial fica mais forte quando junta software, hardware, montagem e acompanhamento.',
    icon: ShieldCheck,
  },
];

const segments = [
  'Restaurantes, cozinhas e cadeia fria',
  'Clinicas, laboratorios e ambientes sensiveis',
  'Reservatorios, bombas e utilidades',
  'Operacoes que vendem e atendem pelo WhatsApp',
];

const plans = [
  {
    name: 'Essencial',
    text: 'Temperatura e monitoramento simples para validar rapido.',
  },
  {
    name: 'Operacao Local',
    text: 'Temperatura com mais regra, rotina e acionamento.',
  },
  {
    name: 'Gestao Completa',
    text: 'Combinacao de modulos para uma entrega mais premium.',
  },
];

const rise = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

type HomePageProps = {
  whatsappUrl: string;
  contactEmail: string;
};

export function HomePage({ whatsappUrl, contactEmail }: HomePageProps) {
  return (
    <main className="site-shell">
      <header className="sticky top-0 z-40 border-b border-white/6 bg-[#071017]/75 backdrop-blur-xl">
        <div className="mx-auto grid min-h-[88px] w-[min(1220px,calc(100%-32px))] grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link
            href="/"
            aria-label="Virtuagil"
            className="inline-flex items-center"
          >
            <Image
              src="/brand/logomarca.png"
              alt="Virtuagil"
              width={176}
              height={48}
              className="h-auto w-[158px] md:w-[176px]"
            />
          </Link>

          <nav className="hidden justify-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/solucoes" className="transition hover:text-white">
              Solucoes
            </Link>
            <Link href="/planos" className="transition hover:text-white">
              Planos
            </Link>
            <Link href="/contato" className="transition hover:text-white">
              Contato
            </Link>
          </nav>

          <Button asChild className="hidden md:inline-flex">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Jade | Como posso ajudar?
            </a>
          </Button>
        </div>
      </header>

      <section className="pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="mx-auto grid w-[min(1220px,calc(100%-32px))] items-center gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <motion.div {...rise}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Site comercial da Virtuagil
            </div>

            <h1 className="text-gradient-brand max-w-[12ch] font-serif text-5xl leading-[0.96] md:text-7xl">
              Tecnologia para vender valor, nao para parecer dashboard.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              A Virtuagil organiza monitoramento, automacao e leitura
              operacional em produtos modulares. O cliente entende o que compra,
              percebe valor rapido e cresce com mais seguranca.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  Falar com a Jade
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contato">Solicitar proposta</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {[
                ['Entrada comercial', 'Temperatura'],
                ['Expansao operacional', 'Acionamento'],
                ['Camada premium', 'Energia'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="surface-glass rounded-[22px] border border-white/8 px-5 py-4"
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {label}
                  </div>
                  <strong className="mt-2 block text-xl">{value}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...rise}
            transition={{ ...rise.transition, delay: 0.08 }}
          >
            <div className="surface-glass rounded-[34px] border border-white/10 p-4 md:p-6">
              <div className="mb-5 flex items-center gap-3 text-sm text-slate-300">
                <Bot className="h-4 w-4 text-sky-300" />
                Jade como assistente comercial
              </div>
              <HeroIllustration />
              <div className="mt-5 rounded-[24px] border border-sky-300/18 bg-sky-300/8 p-5">
                <div className="mb-2 inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-200">
                  Primeira conversa
                </div>
                <h2 className="font-serif text-2xl">Como posso ajudar?</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  A Jade apresenta os modulos, identifica a dor principal e
                  encaminha o visitante para o melhor proximo passo comercial.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-6 md:py-10">
        <div className="mx-auto w-[min(1220px,calc(100%-32px))]">
          <motion.div {...rise} className="mb-6">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
              Oferta comercial
            </div>
            <h2 className="mt-3 max-w-[14ch] font-serif text-4xl leading-tight md:text-5xl">
              Um site para vender confianca, clareza e evolucao por modulos.
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {offers.map((offer, index) => {
              const Icon = offer.icon;
              return (
                <motion.div
                  key={offer.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent>
                      <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
                        <Icon className="h-5 w-5 text-sky-300" />
                      </div>
                      <h3 className="text-xl font-semibold">{offer.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {offer.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto w-[min(1220px,calc(100%-32px))]">
          <motion.div {...rise} className="mb-6">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
              Produtos
            </div>
            <h2 className="mt-3 max-w-[14ch] font-serif text-4xl leading-tight md:text-5xl">
              Cards de venda para os modulos que ja temos hoje.
            </h2>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-3">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.title}
                  {...rise}
                  transition={{ ...rise.transition, delay: index * 0.06 }}
                >
                  <Card
                    className={
                      module.featured
                        ? 'border-amber-300/25 bg-[radial-gradient(circle_at_top_right,rgba(242,201,76,0.14),transparent_34%),rgba(11,18,30,0.86)]'
                        : ''
                    }
                  >
                    <CardContent>
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
                          <Icon className="h-5 w-5 text-sky-300" />
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-amber-200">
                          {module.subtitle}
                        </span>
                      </div>
                      <h3 className="font-serif text-3xl">{module.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-300">
                        {module.text}
                      </p>
                      <ul className="mt-5 grid gap-3 text-sm text-slate-100">
                        {module.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3">
                            <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/solucoes"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300"
                      >
                        Ver modulo
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto grid w-[min(1220px,calc(100%-32px))] gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...rise}>
            <Card>
              <CardContent>
                <div className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-slate-400">
                  <Building2 className="h-4 w-4 text-sky-300" />
                  Segmentos
                </div>
                <h2 className="max-w-[13ch] font-serif text-4xl leading-tight md:text-5xl">
                  Onde a Virtuagil pode vender com mais aderencia.
                </h2>
                <ul className="mt-6 grid gap-3 text-sm leading-7 text-slate-200">
                  {segments.map((segment) => (
                    <li key={segment} className="flex items-start gap-3">
                      <Zap className="mt-1 h-4 w-4 flex-none text-amber-200" />
                      <span>{segment}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            {...rise}
            transition={{ ...rise.transition, delay: 0.08 }}
          >
            <Card className="bg-[radial-gradient(circle_at_top_left,rgba(96,216,165,0.12),transparent_30%),rgba(11,18,30,0.86)]">
              <CardContent>
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
                  Posicionamento
                </div>
                <h2 className="mt-3 max-w-[14ch] font-serif text-4xl leading-tight md:text-5xl">
                  Mais cara de marca e produto. Menos cara de sistema interno.
                </h2>
                <p className="mt-5 text-sm leading-8 text-slate-300">
                  O institucional precisa vender percepcao de valor. O painel
                  tecnico fica para dentro. Aqui, o cliente precisa ver
                  proposta, clareza, confianca e um CTA forte.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      Conversar com a Jade
                    </a>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/planos">Ver pacotes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto w-[min(1220px,calc(100%-32px))]">
          <motion.div {...rise} className="mb-6">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
              Planos e pacotes
            </div>
            <h2 className="mt-3 max-w-[15ch] font-serif text-4xl leading-tight md:text-5xl">
              Pacotes com linguagem comercial e leitura simples.
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                {...rise}
                transition={{ ...rise.transition, delay: index * 0.05 }}
              >
                <Card
                  className={
                    plan.name === 'Operacao Local'
                      ? 'border-sky-300/25 bg-[radial-gradient(circle_at_top_left,rgba(44,184,242,0.14),transparent_28%),rgba(11,18,30,0.86)]'
                      : ''
                  }
                >
                  <CardContent>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Pacote comercial
                    </div>
                    <h3 className="mt-3 font-serif text-3xl">{plan.name}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      {plan.text}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                      Sob consulta
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 pt-8 md:pb-20 md:pt-12">
        <div className="mx-auto w-[min(1220px,calc(100%-32px))]">
          <motion.div {...rise}>
            <Card className="bg-[radial-gradient(circle_at_top_left,rgba(44,184,242,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(242,201,76,0.1),transparent_24%),rgba(11,18,30,0.9)]">
              <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_auto] lg:items-center">
                <div>
                  <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
                    Contato comercial
                  </div>
                  <h2 className="mt-3 max-w-[14ch] font-serif text-4xl leading-tight md:text-5xl">
                    Vamos transformar isso em proposta comercial.
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
                    Se quiser, a Jade pode abrir a conversa agora e orientar a
                    melhor entrada entre ambiental, acionamento, energia ou um
                    projeto personalizado.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      Falar com a Jade
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
