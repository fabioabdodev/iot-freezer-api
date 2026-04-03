import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtuagil | Automação e monitoramento modular',
  description:
    'Automação e monitoramento modular para operações que precisam de mais visibilidade, alertas e evolução por etapas.',
  metadataBase: new URL('https://www.virtuagil.com.br'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/brand/favicon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: ['/favicon.png'],
  },
  openGraph: {
    title: 'Virtuagil | Automação e monitoramento modular',
    description:
      'Soluções modulares de monitoramento, alertas e automação para operações que precisam de mais previsibilidade.',
    url: 'https://www.virtuagil.com.br',
    siteName: 'Virtuagil',
    images: [
      {
        url: '/brand/logomarca.png',
        width: 1200,
        height: 630,
        alt: 'Virtuagil',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
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
