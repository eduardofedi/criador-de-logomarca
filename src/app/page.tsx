import Link from 'next/link';
import { PenTool, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing-page">
      <header className="app-header">
        <div className="container flex-between">
          <div className="logo">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)' }} />
            Criador de Logomarca
          </div>
          <nav>
            <Link href="#como-funciona" style={{ marginRight: 24, fontWeight: 500 }}>Como Funciona</Link>
            <Link href="#precos" style={{ marginRight: 24, fontWeight: 500 }}>Preços</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 0', textAlign: 'center', backgroundColor: '#f0f5ff' }}>
        <div className="container">
          <h1 style={{ maxWidth: '800px', margin: '0 auto 24px', color: '#1E3A8A' }}>
            A Marca dos Seus Sonhos, Gerada por Inteligência Artificial em Segundos.
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.25rem' }}>
            Deixe o design complexo conosco. Basta nos dizer o nome da sua empresa e descrever o que imagina. Nós entregamos um logotipo de nível global, 100% autoral.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Link href="/create" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '1.2rem', borderRadius: '40px' }}>
              Criar Meu Logotipo Agora
            </Link>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Não requer cartão de crédito para testar.</span>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="como-funciona" style={{ padding: '80px 0', backgroundColor: '#fff' }}>
        <div className="container text-center">
          <h2>Como Funciona?</h2>
          <p>Três passos simples para profissionalizar seu negócio.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '48px' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <PenTool size={32} />
              </div>
              <h3 style={{ marginBottom: '16px' }}>1. Diga sua visão</h3>
              <p style={{ textAlign: 'center', margin: 0 }}>Fale ou digite como você imagina sua marca. Cores, formas e sensações.</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <Zap size={32} />
              </div>
              <h3 style={{ marginBottom: '16px' }}>2. Extração via IA</h3>
              <p style={{ textAlign: 'center', margin: 0 }}>Nossa inteligência artificial cria uma direção criativa em instantes.</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ marginBottom: '16px' }}>3. Pague e Baixe</h3>
              <p style={{ textAlign: 'center', margin: 0 }}>Se gostar do resultado, pague de forma segura e baixe em alta resolução (PNG, SVG).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safe Payment */}
      <section id="precos" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="glass-card" style={{ border: '2px solid var(--color-primary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--color-primary)' }}>Transparência e Qualidade</h2>
            <br />
            <h1 style={{ fontSize: '4rem', marginBottom: '8px' }}>R$ 49,90</h1>
            <p style={{ margin: '0 auto 32px' }}>Pagamento único. Seu logo disponível na hora.</p>

            <div style={{ textAlign: 'left', marginBottom: '32px', width: 'fit-content', margin: '0 auto 32px' }}>
              <p>✓ Cópia do Logotipo em Alta Resolução (PNG)</p>
              <p>✓ Estrutura Vetorial Master (SVG)</p>
              <p>✓ Fundo Transparente incluso</p>
              <p>✓ Uso Comercial liberado 100%</p>
            </div>

            <Link href="/create" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
              Iniciar Criação Grátis
            </Link>

            <p style={{ fontSize: '0.8rem', marginTop: '16px', marginBottom: 0 }}>
              Pagamento 100% Seguro via Mercado Pago. Privacidade garantida pela LGPD.
            </p>
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px 0', backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'center' }}>
        <div className="container">
          <p>© 2026 Criador de Logomarca. Todos os direitos reservados.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.875rem' }}>
            <span>Termos de Uso</span>
            <span>Política de Privacidade</span>
            <span>Contato</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
