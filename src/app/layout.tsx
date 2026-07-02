import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Criador de Logomarca | Logotipos Profissionais",
  description: "Crie o logotipo da sua empresa em segundos. Designs exclusivos, de alto impacto visual e prontos para uso comercial. Experimente grátis!",
  keywords: ["criador de logomarca", "logotipo online", "fazer logo online", "design de logo"],
  openGraph: {
    title: "Criador de Logomarca | Premium Logo Design",
    description: "Crie o logotipo da sua empresa em segundos com design de alto padrão.",
    type: "website",
    locale: "pt_BR",
    url: "https://criadordelogomarca.com.br",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
