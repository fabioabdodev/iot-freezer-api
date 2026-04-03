import Link from 'next/link';

export default function PlanosPage() {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="container glass-card">
          <p className="eyebrow">Planos</p>
          <h1 className="section-title">
            Pacotes pensados para a etapa certa.
          </h1>
          <p className="section-copy">
            O institucional apresenta pacotes simples e consultivos. O
            detalhamento comercial pode ser refinado depois com proposta formal.
          </p>
          <ul className="list">
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">Essencial</span>
            </li>
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">Operacao Local</span>
            </li>
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">Gestao Completa</span>
            </li>
            <li className="list-item">
              <span className="list-dot" />
              <span className="list-copy">Projeto Personalizado</span>
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
