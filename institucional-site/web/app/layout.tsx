import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtuagil | Automacao e monitoramento modular',
  description:
    'Automacao e monitoramento modular para operacoes que precisam de mais visibilidade, alertas e evolucao por etapas.',
  metadataBase: new URL('https://www.virtuagil.com.br'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
