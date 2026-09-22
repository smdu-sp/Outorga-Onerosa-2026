import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora OODC – Outorga Onerosa São Paulo",
  description:
    "Cálculo de Outorga Onerosa do Direito de Construir – Lei nº 16.050/2014 (PDE) e Lei nº 17.202/2019 – Município de São Paulo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
          Calculadora OODC – São Paulo · Lei nº 16.050/2014 (PDE) e Lei nº 17.202/2019 · Uso estimativo — consulte a SEL para fins legais
        </footer>
      </body>
    </html>
  );
}
