import { ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";
import LogoGenerator from "@/components/LogoGenerator";
import RecentSalesToast from "@/components/RecentSalesToast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0; // Desativando o cache no servidor da Home para exibir novos posts na hora

export default async function Home() {
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('title, slug, content')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-white text-gray-900 scroll-smooth selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Premium Header/Nav */}
      <nav className="flex justify-between items-center px-6 md:px-12 lg:px-24 py-6 max-w-[1600px] mx-auto border-b border-gray-100">
        <div className="text-xl font-black flex items-center gap-3 tracking-tight text-gray-900">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/20">
            C
          </div>
          Criador de Logomarca
        </div>
        <div className="hidden md:flex gap-10 text-sm font-semibold text-gray-600">
          <a href="#generator" className="hover:text-blue-600 transition-colors duration-300">Criar Marca</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors duration-300">Método</a>
          <a href="#testimonials" className="hover:text-blue-600 transition-colors duration-300">Depoimentos</a>
          <a href="#faq" className="hover:text-blue-600 transition-colors duration-300">Dúvidas</a>
          <a href="/blog" className="hover:text-blue-600 transition-colors duration-300">Blog</a>
        </div>
        <div className="hidden md:block">
          <a href="#generator" className="px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-colors duration-300">
            Começar
          </a>
        </div>
      </nav>

      {/* 1. First Fold (Hero + Briefing) */}
      <section id="generator" className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-12 pb-24 md:pt-20 md:pb-32 relative animate-in fade-in zoom-in-95 duration-1000 fill-mode-both">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="grid xl:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Hero Text */}
          <div className="xl:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest">
              Design Premium
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-gray-900">
              Sua marca com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">força e presença</span> <br />
              visual de verdade.
            </h1>
            
            <h2 className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed font-normal">
              O segredo das empresas que mais vendem é uma marca que transmite confiança instantânea. Desenvolvemos logotipos de extremo alto padrão que destacam o seu negócio da concorrência e valorizam o seu produto na primeira olhada.
            </h2>
            
            <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-6 md:pt-8">
              <div className="flex flex-col gap-1">
                <div className="text-2xl md:text-3xl font-black text-gray-900">12k+</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Projetos Feitos</div>
              </div>
              <div className="w-px h-10 md:h-12 bg-gray-200"></div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl md:text-3xl font-black text-gray-900">99.4%</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Briefing Form (Right Side) */}
          <div className="xl:col-span-6 relative z-10 w-full max-w-xl mx-auto xl:mr-0">
            <LogoGenerator />
          </div>
        </div>
      </section>

      {/* 2. Como Funciona Section */}
      <section id="how-it-works" className="bg-gray-50/50 py-32 border-y border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: '150ms' }}>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">O Método</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Como Funciona Nosso Sistema</h2>
            <p className="text-gray-600 text-lg">Em três passos simples, nosso sistema traduz sua visão em um design excepcional.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Defina o Briefing", desc: "Informe o nome da sua empresa, o seu nicho e descreva o que você deseja ver no logotipo (pode pedir elementos específicos como pizza, dentes, carros, etc.)." },
              { step: "02", title: "Geração do Design", desc: "Nosso sistema calcula as proporções, escolhe a tipografia de alta presença e desenha o logotipo perfeito para a sua empresa." },
              { step: "03", title: "Receba o Logotipo", desc: "Ao finalizar a compra, você faz o download instantâneo da imagem em alta resolução pronta para uso." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm relative group hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${200 + idx * 100}ms` }}>
                <span className="text-7xl font-black text-gray-50 absolute top-8 right-8 group-hover:text-blue-100 group-hover:rotate-12 transition-all duration-500">{item.step}</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">{item.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Testimonials Section */}
      <section id="testimonials" className="py-32 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Validação</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Marcas Reais, Clientes Satisfeitos</h2>
          <p className="text-gray-600 text-lg">Veja o que dizem empreendedores que transformaram a imagem de seus negócios.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { name: "Carlos Souza", role: "Pizzaria Bella Italia", initials: "CS", color: "bg-red-50 text-red-600", text: "Excelente! Eu queria algo clássico com uma fatia de pizza e o nome bem forte. O resultado veio de primeira e já mandei rodar as caixas da pizzaria com ele.", rating: "★★★★★" },
            { name: "Dra. Mariana Costa", role: "Odontologia Integrada", initials: "MC", color: "bg-teal-50 text-teal-600", text: "Demorou uns segundinhos a mais do que eu esperava pra gerar na tela, mas me surpreendeu muito. Conseguiu criar um ícone de dente integrado de forma sutil e sofisticada. Muito superior aos templates da internet.", rating: "★★★★½" },
            { name: "Marcos Lima", role: "Oficina AutoTech", initials: "ML", color: "bg-orange-50 text-orange-600", text: "O logotipo facilitou muito para eu fazer a fachada da oficina. Cores bem escolhidas e o símbolo do carro ficou animal.", rating: "★★★★★" },
            { name: "Felipe Nunes", role: "Nunes Advocacia", initials: "FN", color: "bg-yellow-50 text-yellow-600", text: "Procurava uma marca séria, minimalista e imponente. Queria mais opções de fontes clássicas, mas o resultado final com monograma ficou perfeito para o meu escritório de advocacia.", rating: "★★★★½" },
            { name: "Juliana Rocha", role: "Studio Glow Estética", initials: "JR", color: "bg-pink-50 text-pink-600", text: "Fiz o logo para o meu salão. As cores e a tipografia ficaram super chiques e elegantes. Recomendo muito!", rating: "★★★★★" },
            { name: "Roberto Silva", role: "Iron Gym", initials: "RS", color: "bg-blue-50 text-blue-600", text: "Robusto e moderno. O símbolo do escudo com as iniciais ficou excelente para estampar as camisetas e a fachada da academia.", rating: "★★★★★" },
          ].map((t, idx) => (
            <div key={idx} className="bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 p-6 md:p-10 rounded-3xl md:rounded-[2rem] space-y-6 hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${150 + (idx % 3) * 100}ms` }}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${t.color} flex items-center justify-center text-lg font-black`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg text-gray-900">{t.name}</h4>
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">"{t.text}"</p>
              <div className="flex text-yellow-400 text-base md:text-lg tracking-widest">{t.rating}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recent Posts Section */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="bg-gray-50/50 py-32 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
              <div className="space-y-4">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Conteúdo</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Artigos Recentes</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-900 font-bold transition-colors duration-300">
                Ver blog completo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post: any, idx: number) => (
                <article key={post.slug} className="group flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${200 + idx * 100}ms` }}>
                  <div className="bg-white border border-gray-200 p-10 rounded-[2rem] h-full flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200 hover:-translate-y-2 transition-all duration-500">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 mb-4">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-8">
                        {post.content.replace(/[#*_-]/g, '')}
                      </p>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
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
      <section id="faq" className="py-32 border-t border-gray-100 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Suporte</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 flex items-center justify-center gap-4">
              <HelpCircle className="text-blue-600 w-10 h-10" /> Dúvidas Frequentes
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Vou receber o logotipo em qual formato?", a: "Você receberá o logotipo em formato de imagem em altíssima resolução (PNG Premium - 2000x2000px). Este é o formato universal, perfeito para ser aplicado em redes sociais, sites, cartões de visita, fachadas e todo o seu material de marketing instantaneamente." },
              { q: "Posso registrar a marca gerada?", a: "Absolutamente! Ao comprar o logotipo, todos os direitos comerciais, patrimoniais e de propriedade intelectual são transferidos 100% para você. Você é o dono legal e exclusivo da marca, podendo registrá-la no INPI sem restrições." },
              { q: "Por quanto tempo o logo fica disponível para download?", a: "Os dados ficam armazenados nos nossos servidores por apenas 24 horas após a geração por questões de privacidade e otimização. Baixe seus arquivos assim que concluir a compra!" },
              { q: "E se eu não gostar do resultado?", a: "Você pode gerar até 3 variações gratuitas para testar diferentes descrições e estilos antes de decidir pela compra." },
              { q: "Como funciona o pagamento?", a: "O pagamento é processado de forma 100% segura e instantânea via PIX utilizando a plataforma Asaas. Assim que aprovado, o arquivo é enviado direto para o seu e-mail." },
              { q: "Consigo aplicar o logotipo sobre fotos ou fundos escuros?", a: "Sim! Como entregamos o logotipo com contraste bem definido e altíssima resolução, é super fácil para você ou sua gráfica utilizarem ferramentas simples (como Canva ou Photoshop) para remover o fundo branco e aplicá-lo perfeitamente como marca d'água em qualquer lugar." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${100 + idx * 50}ms` }}>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.q}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5. SEO Heavy Content Block */}
      <section className="bg-gray-50/50 py-32 border-t border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 lg:px-24 prose prose-lg prose-blue">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
            Por que um Logotipo Premium é o Motor de Crescimento da sua Empresa?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            No mercado digital atual, a primeira impressão não é apenas importante — ela é o fator decisivo para a conversão. Estudos de neuromarketing comprovam que o cérebro humano processa imagens 60.000 vezes mais rápido que textos. Ter um logotipo profissional, criado com diretrizes geométricas rígidas, alto contraste e harmonia tipográfica, posiciona seu negócio instantaneamente acima da concorrência.
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Como a identidade visual impacta o seu ticket médio</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Empresas que investem em um design premium conseguem cobrar mais caro por seus produtos e serviços. O motivo é simples: a percepção de valor. Um design amador transmite insegurança e barateia a oferta. Por outro lado, um design estruturado, com uma paleta de cores correta e proporções matemáticas, aciona gatilhos de autoridade no subconsciente do seu cliente. 
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            O <strong>Criador de Logomarca</strong> foi arquitetado exatamente para resolver esse problema de forma imediata. Baseado nos princípios de grandes mestres do design como Paul Rand e Massimo Vignelli, nossa plataforma entrega não apenas uma imagem, mas um sistema visual coeso e de altíssima resolução, pronto para estampar a fachada do seu negócio físico, as embalagens dos seus produtos e todo o seu ecossistema digital nas redes sociais.
          </p>
        </div>
      </section>

      {/* 6. Beautiful Premium Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6 col-span-2 md:col-span-1">
            <div className="text-xl font-black flex items-center gap-3 text-white tracking-tight">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-base">
                C
              </div>
              Criador de Logomarca
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Criador de Logomarca é a plataforma definitiva para empresas que buscam elevar o padrão visual. Crie sua identidade premium, impulsione suas vendas e conquiste o respeito do mercado em minutos.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#generator" className="hover:text-white transition-colors">Criar Marca</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Perguntas Frequentes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Conteúdo</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog Oficial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Segurança</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>Políticas de Privacidade</li>
              <li>Termos de Uso</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 Criador de Logomarca (criadordelogomarca.com.br). Todos os direitos reservados.</p>
          <p className="text-sm text-gray-500 font-medium">Pagamentos seguros 100% via PIX.</p>
        </div>
      </footer>

      {/* 🔔 Floating Sales Notification */}
      <RecentSalesToast />

    </main>
  );
}
