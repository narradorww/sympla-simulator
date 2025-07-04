import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agroforestree × Sympla | Integração ESG',
  description: 'Prova de conceito da integração entre Sympla e Agroforestree para plantio automático de árvores',
  keywords: 'agroforestree, sympla, esg, sustentabilidade, plantio, árvores, eventos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
