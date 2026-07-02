import { ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";
import LogoGenerator from "@/components/LogoGenerator";
import RecentSalesToast from "@/components/RecentSalesToast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0; // Desativando o cache no servidor da Home para exibir novos posts na hora

export default async function Home() {
  // Buscar os 3 posts mais recentes para a seção de posts recentes
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('title, slug, content')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-[#050505] text-white scroll-smooth selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Premium Header/Nav */}
      <nav className="flex justify-between items-center px-6 md:px-12 lg:px-24 py-6 max-w-7xl mx-auto">
        <div className="text-xl font-black flex items-center gap-3 tracking-tight">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/20">
            C
          </div>
          Criador de Logomarca
        </div>
        <div className="hidden md:flex gap-10 text-sm font-semibold text-gray-400">
          <a href="#generator" className="hover:text-white transition-colors duration-300">Criar Marca</a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-300">Método</a>
          <a href="#testimonials" className="hover:text-white transition-colors duration-300">Depoimentos</a>
          <a href="#faq" className="hover:text-white transition-colors duration-300">Dúvidas</a>
          <a href="/blog" className="hover:text-white transition-colors duration-300">Blog</a>
        </div>
        <div className="hidden md:block">
          <a href="#generator" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors duration-300">
            Começar
          </a>
        </div>
      </nav>

      {/* 1. First Fold (Hero + Briefing) */}
      <section id="generator" className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-12 pb-24 md:pt-16 md:pb-32 relative">
        {/* Subtle glow behind hero */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="grid xl:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Hero Text */}
          <div className="xl:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Inteligência Artificial Premium
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-white">
              Sua marca com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">força e presença</span> <br />
              visual de verdade.
            </h1>
            
            <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
              Garanta a melhor primeira impressão para a sua empresa. Criamos logotipos profissionais e de alto impacto que destacam o seu negócio, atraem mais clientes e valorizam os seus serviços de forma instantânea.
            </p>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-black text-white">12k+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Projetos Feitos</div>
              </div>
              <div className="w-px h-12 bg-gray-800"></div>
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-black text-white">99.4%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Briefing Form (Right Side) */}
          <div className="xl:col-span-6 relative z-10">
            <LogoGenerator />
          </div>
        </div>
      </section>

      {/* 2. Como Funciona Section */}
      <section id="how-it-works" className="bg-[#020202] py-32 border-y border-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">O Método</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Como Funciona Nosso Sistema</h2>
            <p className="text-gray-400 text-lg">Em três passos simples, a inteligência artificial traduz sua visão em um design excepcional.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Defina o Briefing", desc: "Informe o nome da sua empresa, o seu nicho e descreva o que você deseja ver no logotipo (pode pedir elementos específicos como pizza, dentes, carros, etc.)." },
              { step: "02", title: "Geração do Design", desc: "Nosso sistema calcula as proporções, escolhe a tipografia de alta presença e desenha o logotipo perfeito para a sua empresa." },
              { step: "03", title: "Receba o Logotipo", desc: "Ao finalizar a compra, você faz o download instantâneo da imagem em alta resolução pronta para uso." }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-b from-[#0a0a0a] to-black p-10 rounded-[2rem] border border-gray-800/50 relative group hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                <span className="text-7xl font-black text-blue-500/5 absolute top-8 right-8 group-hover:text-blue-500/10 transition-colors duration-500">{item.step}</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Testimonials Section */}
      <section id="testimonials" className="py-32 max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Validação</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Marcas Reais, Clientes Satisfeitos</h2>
          <p className="text-gray-400 text-lg">Veja o que dizem empreendedores que transformaram a imagem de seus negócios.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Carlos Souza", role: "Pizzaria Bella Italia", initials: "CS", color: "from-red-600 to-red-800", text: "Excelente! Eu queria algo clássico com uma fatia de pizza e o nome bem forte. O resultado veio de primeira e já mandei rodar as caixas da pizzaria com ele." },
            { name: "Dra. Mariana Costa", role: "Odontologia Integrada", initials: "MC", color: "from-teal-500 to-teal-700", text: "Me surpreendeu muito. Conseguiu criar um ícone de dente integrado de forma sutil e sofisticada, fugindo completamente daqueles logos genéricos de internet." },
            { name: "Marcos Lima", role: "Oficina AutoTech", initials: "ML", color: "from-orange-500 to-orange-700", text: "O logotipo facilitou muito para eu fazer a fachada da oficina. Cores bem escolhidas e o símbolo do carro ficou animal." },
            { name: "Felipe Nunes", role: "Nunes Advocacia", initials: "FN", color: "from-yellow-600 to-yellow-800", text: "Procurava uma marca séria, minimalista e imponente. O resultado final com monograma ficou perfeito para o meu escritório de advocacia." },
            { name: "Juliana Rocha", role: "Studio Glow Estética", initials: "JR", color: "from-pink-500 to-pink-700", text: "Fiz o logo para o meu salão. As cores e a tipografia ficaram super chiques e elegantes. Recomendo muito!" },
            { name: "Roberto Silva", role: "Iron Gym", initials: "RS", color: "from-blue-600 to-blue-800", text: "Robusto e moderno. O símbolo do escudo com as iniciais ficou excelente para estampar as camisetas e a fachada da academia." },
          ].map((t, idx) => (
            <div key={idx} className="bg-[#050505] border border-gray-800/60 p-8 rounded-[2rem] space-y-6 hover:border-gray-700 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-black shadow-inner`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{t.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex text-blue-500 text-sm">★★★★★</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recent Posts Section */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="bg-[#020202] py-32 border-t border-gray-900/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Conteúdo</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Artigos Recentes</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors duration-300">
                Ver blog completo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post: any) => (
                <article key={post.slug} className="group flex flex-col justify-between">
                  <div className="bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-[2rem] h-full flex flex-col justify-between group-hover:border-gray-700 transition-colors duration-300">
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors duration-300 mb-4">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-8">
                        {post.content.replace(/[#*_-]/g, '')}
                      </p>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-blue-500 font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                      Ler Artigo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQ Section */}
      <section id="faq" className="py-32 border-t border-gray-900/50 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20 space-y-4">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Suporte</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-4">
              <HelpCircle className="text-blue-500 w-10 h-10" /> Dúvidas Frequentes
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Vou receber o logotipo em qual formato?", a: "Você receberá o logotipo em formato vetorial de altíssima resolução (SVG), que garante qualidade infinita sem pixelar, ideal para impressões gigantes ou uso digital, além de permitir conversões para qualquer outro formato que precisar." },
              { q: "Posso registrar a marca gerada?", a: "Sim. Ao comprar o logotipo, todos os direitos comerciais e de propriedade intelectual são transferidos para você, permitindo o registro no INPI." },
              { q: "Por quanto tempo o logo fica disponível para download?", a: "Os dados ficam armazenados nos nossos servidores por apenas 24 horas após a geração por questões de privacidade e otimização. Baixe seus arquivos assim que concluir a compra!" },
              { q: "E se eu não gostar do resultado?", a: "Você pode gerar até 3 variações gratuitas para testar diferentes descrições e estilos antes de decidir pela compra." },
              { q: "Como funciona o pagamento?", a: "O pagamento é processado de forma 100% segura e instantânea via PIX utilizando a plataforma Asaas. Assim que aprovado, o arquivo é enviado direto para o seu e-mail." },
              { q: "Consigo editar as cores do logotipo depois?", a: "Como entregamos o arquivo em formato vetorial aberto (SVG), você ou qualquer designer pode fazer alterações estruturais, de cor e tipografia facilmente no futuro usando softwares como Illustrator ou Figma." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-gray-800/50 p-8 rounded-2xl hover:bg-[#0c0c0c] transition-colors duration-300">
                <h3 className="text-lg font-bold mb-3 text-white">{faq.q}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Beautiful Premium Footer */}
      <footer className="bg-black border-t border-gray-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6 col-span-2 md:col-span-1">
            <div className="text-xl font-black flex items-center gap-3 text-white tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-black text-white text-sm">
                C
              </div>
              Criador de Logomarca
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Sistema inteligente de design gráfico focado em marcas geométricas de alto padrão para empresas visionárias.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#generator" className="hover:text-white transition-colors">Criar Marca</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Perguntas Frequentes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Conteúdo</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog Oficial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Segurança</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>Políticas de Privacidade</li>
              <li>Termos de Uso</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-8 border-t border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">© 2026 Criador de Logomarca (criadordelogomarca.com.br). Todos os direitos reservados.</p>
          <p className="text-sm text-gray-600 font-medium">Pagamentos seguros 100% via PIX.</p>
        </div>
      </footer>

      {/* 🔔 Floating Sales Notification */}
      <RecentSalesToast />

    </main>
  );
}
