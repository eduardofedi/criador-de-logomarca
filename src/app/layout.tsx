import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Criador de Logomarca | Logotipos Profissionais com Inteligência Artificial",
  description: "Crie o logotipo da sua empresa em segundos com inteligência artificial. Designs exclusivos, de alto impacto visual e prontos para uso comercial. Experimente grátis!",
  keywords: ["criador de logomarca", "logotipo online", "fazer logo online", "logo inteligência artificial", "design de logo"],
  openGraph: {
    title: "Criador de Logomarca | AI Premium Logo Design",
    description: "Crie o logotipo da sua empresa em segundos com inteligência artificial de alto padrão.",
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
