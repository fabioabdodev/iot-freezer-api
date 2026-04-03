import Image from 'next/image';
import Link from 'next/link';

const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? 'https://wa.me/5531999990000';
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contato@virtuagil.com.br';

const problems = [
  'Temperatura fora da faixa sem aviso rapido',
  'Equipamentos sem visibilidade operacional',
  'Atendimento manual repetitivo no WhatsApp',
  'Rotinas soltas e sem rastreabilidade',
];

const modules = [
  {
    title: 'Ambiental',
    copy: 'Temperatura como porta de entrada comercial, com historico, faixa esperada e alertas objetivos.',
  },
  {
    title: 'Acionamento',
    copy: 'Controle operacional por etapas para ligar, desligar ou automatizar pontos quando a operacao exigir.',
  },
  {
    title: 'Energia',
    copy: 'Leitura de corrente, tensao e consumo para evoluir o monitoramento com saude eletrica e previsibilidade.',
  },
];

const segments = [
  'Restaurantes e operacoes refrigeradas',
  'Clinicas e laboratorios',
  'Negocios com atendimento intenso via WhatsApp',
  'Operacoes que precisam evoluir por modulos',
];

const packages = [
  {
    name: 'Essencial',
    subtitle: 'Entrada enxuta',
    price: 'Sob consulta',
    copy: 'Comece com monitoramento de temperatura e leitura simples da operacao.',
  },
  {
    name: 'Operacao Local',
    subtitle: 'Mais controle',
    price: 'Sob consulta',
    copy: 'Amplie com regras, acionamentos e rotina mais estruturada no campo.',
    featured: true,
  },
  {
    name: 'Gestao Completa',
    subtitle: 'Mais profundidade',
    price: 'Sob consulta',
    copy: 'Una monitoramento, automacao e visibilidade operacional em uma proposta mais robusta.',
  },
  {
    name: 'Projeto Personalizado',
    subtitle: 'Consultivo',
    price: 'Conversar',
    copy: 'Quando a operacao pede desenho sob medida, modulos combinados e integracoes especificas.',
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="nav">
        <div className="container nav-row">
          <div className="nav-brand">Virtuagil</div>
          <div className="nav-actions">
            <Link href="/solucoes" className="btn-secondary">
              Solucoes
            </Link>
            <Link href="/planos" className="btn-secondary">
              Planos
            </Link>
            <a
              href={whatsappUrl}
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Jade | Como posso ajudar?
            </a>
          </div>
        </div>
      </header>

      <section className="section-tight">
        <div className="container hero-grid">
          <div>
            <div className="pill">Automacao e monitoramento modular</div>
            <h1 className="hero-title">
              Tecnologia aplicada a operacoes reais, sem comecar grande demais.
            </h1>
            <p className="hero-copy">
              A Virtuagil estrutura monitoramento, automacao e fluxos comerciais
              por etapas. Voce pode comecar por temperatura, evoluir para
              acionamento e ampliar quando a operacao pedir mais.
            </p>
            <div className="nav-actions" style={{ marginTop: 24 }}>
              <a
                href={whatsappUrl}
                className="btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Falar com a Jade
              </a>
              <Link href="/contato" className="btn-secondary">
                Solicitar contato
              </Link>
            </div>
            <div className="hero-metrics">
              <div className="metric">
                <span className="eyebrow">Entrada comercial</span>
                <span className="metric-value">Temperatura</span>
              </div>
              <div className="metric">
                <span className="eyebrow">Expansao</span>
                <span className="metric-value">Acionamento</span>
              </div>
              <div className="metric">
                <span className="eyebrow">Valor agregado</span>
                <span className="metric-value">Energia</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <p className="eyebrow">Assistente comercial</p>
            <h2 className="section-title" style={{ fontSize: '2.1rem' }}>
              Jade
            </h2>
            <p className="section-copy">
              A Jade representa a primeira conversa comercial da Virtuagil. Ela
              ajuda a entender a necessidade, orientar o visitante e abrir o
              melhor proximo passo.
            </p>
            <ul className="list">
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">Como posso ajudar?</span>
              </li>
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">
                  Explica modulos e pacotes de forma simples.
                </span>
              </li>
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">
                  Encaminha para WhatsApp e contato comercial.
                </span>
              </li>
            </ul>
            <div style={{ marginTop: 28 }}>
              <Image
                src="/brand/logomarca.png"
                alt="Virtuagil"
                width={220}
                height={64}
                style={{ height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Problemas reais</p>
          <h2 className="section-title">
            A operacao trava quando falta visibilidade.
          </h2>
          <div className="grid-two" style={{ marginTop: 28 }}>
            {problems.map((problem) => (
              <article key={problem} className="card">
                <h3 className="card-title">{problem}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Modelo modular</p>
          <h2 className="section-title">
            Comece por um modulo. Evolua quando fizer sentido.
          </h2>
          <div className="grid-three" style={{ marginTop: 28 }}>
            {modules.map((module) => (
              <article key={module.title} className="glass-card">
                <h3 className="feature-title">{module.title}</h3>
                <p className="card-copy">{module.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <div className="glass-card">
            <p className="eyebrow">Segmentos</p>
            <h2 className="section-title">Onde a Virtuagil pode atuar</h2>
            <ul className="list">
              {segments.map((segment) => (
                <li key={segment} className="list-item">
                  <span className="list-dot" />
                  <span className="list-copy">{segment}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card">
            <p className="eyebrow">Como funciona</p>
            <h2 className="section-title">
              Conversa, proposta, implantacao e evolucao.
            </h2>
            <ul className="list">
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">
                  Entendimento da operacao e da dor principal.
                </span>
              </li>
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">
                  Proposta comercial mais enxuta para a etapa atual.
                </span>
              </li>
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">
                  Implantacao e acompanhamento inicial.
                </span>
              </li>
              <li className="list-item">
                <span className="list-dot" />
                <span className="list-copy">
                  Expansao por modulos e automacoes quando houver valor real.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Planos e pacotes</p>
          <h2 className="section-title">
            Pacotes que respeitam o momento da sua operacao.
          </h2>
          <div className="grid-four" style={{ marginTop: 28 }}>
            {packages.map((item) => (
              <article
                key={item.name}
                className={`glass-card pricing-card${
                  item.featured ? ' featured' : ''
                }`}
              >
                <p className="eyebrow">{item.subtitle}</p>
                <h3 className="feature-title">{item.name}</h3>
                <div className="price">{item.price}</div>
                <p className="card-copy">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container glass-card">
          <p className="eyebrow">Contato</p>
          <h2 className="cta-title section-title">
            Vamos entender a sua operacao?
          </h2>
          <p className="section-copy">
            A Virtuagil pode comecar por uma etapa simples, validar valor e
            evoluir com mais seguranca.
          </p>
          <div className="nav-actions" style={{ marginTop: 24 }}>
            <a
              href={whatsappUrl}
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Falar com a Jade no WhatsApp
            </a>
            <a href={`mailto:${contactEmail}`} className="btn-secondary">
              {contactEmail}
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          Virtuagil | Automacao e monitoramento modular
        </div>
      </footer>
    </main>
  );
}
