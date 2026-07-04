import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Criador de Logomarca | Faça Seu Logotipo Profissional Online",
  description: "Crie a logomarca perfeita para sua empresa. Gerador de logotipo profissional focado em branding de alto padrão, conversão e exclusividade. Teste agora!",
  keywords: ["criador de logomarca", "logotipo online", "fazer logo", "criar logomarca gratis", "gerador de logotipo", "identidade visual empresa"],
  openGraph: {
    title: "Criador de Logomarca | Faça Seu Logotipo Profissional Online",
    description: "Crie a logomarca perfeita para sua empresa. Design de alto padrão, pronto para impressão e redes sociais.",
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
