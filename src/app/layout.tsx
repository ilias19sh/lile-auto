import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "L'Île Auto | Sélection de Véhicules Premium à Lille",
  description: "Découvrez notre inventaire exclusif de véhicules sélectionnés et révisés. Vente, achat et recherche sur-mesure de votre voiture sur la métropole lilloise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-200 selection:text-emerald-900`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
