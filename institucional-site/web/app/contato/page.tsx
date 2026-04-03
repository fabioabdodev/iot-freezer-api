const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? 'https://wa.me/5531999990000';
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contato@virtuagil.com.br';

export default function ContatoPage() {
  return (
    <main className="page-shell">
      <section className="section">
        <div className="container glass-card">
          <p className="eyebrow">Contato</p>
          <h1 className="section-title">Fale com a Virtuagil</h1>
          <p className="section-copy">
            Se quiser entender a melhor entrada para a sua operacao, a Jade pode
            iniciar a conversa pelo WhatsApp.
          </p>
          <div className="nav-actions" style={{ marginTop: 24 }}>
            <a
              href={whatsappUrl}
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Jade | Como posso ajudar?
            </a>
            <a href={`mailto:${contactEmail}`} className="btn-secondary">
              {contactEmail}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
