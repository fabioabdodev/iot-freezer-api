import Link from 'next/link';

export default function SolucoesPage() {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="container glass-card">
          <p className="eyebrow">Solucoes</p>
          <h1 className="section-title">
            Modulos que evoluem junto com a operacao.
          </h1>
          <p className="section-copy">
            A Virtuagil organiza a oferta em modulos para voce comecar por um
            problema claro e ampliar depois com mais controle.
          </p>
          <ul className="list">
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">
                Ambiental: temperatura como porta de entrada.
              </span>
            </li>
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">
                Acionamento: controle operacional por etapas.
              </span>
            </li>
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">
                Energia: leitura eletrica para ampliar visibilidade.
              </span>
            </li>
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">
                Jade e WhatsApp: recepcao comercial e fluxos iniciais.
              </span>
            </li>
          </ul>
          <div style={{ marginTop: 24 }}>
            <Link href="/" className="btn-secondary">
              Voltar para home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
