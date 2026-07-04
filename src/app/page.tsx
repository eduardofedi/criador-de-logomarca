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

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-gray-900">
              Engenharia visual para marcas de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">impacto instantâneo.</span>
            </h1>
            
            <h2 className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed font-normal">
              Nós dominamos a inteligência artificial para que você não precise tentar a sorte com prompts. O resultado? Logotipos estruturados com rigor técnico, peso visual e extremo alto padrão, prontos para o mercado.
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
              { step: "01", title: "O Contexto", desc: "Você nos conta o básico: o nome da empresa e o mercado. Não precisa inventar descrições complexas, nossa arquitetura entende o que funciona para o seu nicho." },
              { step: "02", title: "Engenharia Visual", desc: "Nossos motores de IA não 'chutam' imagens. Eles aplicam parâmetros rigorosos de direção de arte, proporção, contraste e tipografia para criar algo duradouro." },
              { step: "03", title: "Pronto para o Mundo", desc: "Diferente de geradores que entregam arquivos inúteis, você baixa a arte final (PNG 2000px) pronta para estampar fachadas, redes sociais e uniformes." }
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

      {/* 2.5. Objection Handling: Por que nós? */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">O Elefante na Sala</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
                "Por que não usar uma inteligência artificial genérica?"
              </h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold flex-shrink-0 mt-1">✕</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">IAs Genéricas entregam caos</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Se você pedir um logo para uma IA comum, ela vai te entregar ilustrações complexas, textos com erros de ortografia, gradientes impossíveis de imprimir e mockups 3D inúteis. Elas desenham bonito, mas não entendem de <strong>regras de design corporativo</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold flex-shrink-0 mt-1">✓</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Nós entregamos Engenharia Visual</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Nossa plataforma age como um "tradutor técnico". Nós pegamos a sua ideia simples e a reescrevemos sob o capô utilizando <strong>diretrizes de mestres do design</strong> (como Paul Rand e Paula Scher). O resultado sai com tipografia legível, contraste alto e pronto para uso comercial.
                  </p>
                </div>
              </div>
            </div>
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
            { name: "Dra. Mariana Costa", role: "Odontologia Integrada", initials: "MC", color: "bg-teal-50 text-teal-600", text: "Demorou uns segundinhos a mais do que eu esperava pra gerar na tela, mas me surpreendeu muito. Conseguiu criar um ícone de dente integrado de forma sutil e sofisticada. Muito superior aos templates da internet.", rating: "★★★★☆" },
            { name: "Marcos Lima", role: "Oficina AutoTech", initials: "ML", color: "bg-orange-50 text-orange-600", text: "O logotipo facilitou muito para eu fazer a fachada da oficina. Cores bem escolhidas e o símbolo do carro ficou animal.", rating: "★★★★★" },
            { name: "Felipe Nunes", role: "Nunes Advocacia", initials: "FN", color: "bg-yellow-50 text-yellow-600", text: "Procurava uma marca séria, minimalista e imponente. Queria mais opções de fontes clássicas, mas o resultado final com monograma ficou perfeito para o meu escritório de advocacia.", rating: "★★★★☆" },
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

      {/* 5.5. SEO Heavy Content Block - Redesigned Premium */}
      <section className="bg-gray-50/50 py-32 border-t border-gray-100 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Design com Propósito</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
              Por que um Logotipo Premium é o Motor de Crescimento da sua Empresa?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              No mercado digital atual, a primeira impressão não é apenas importante — ela é o fator decisivo para a conversão. Veja como a identidade visual certa muda o jogo.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Processamento Imediato</h3>
              <p className="text-gray-600 leading-relaxed">
                Estudos de neuromarketing comprovam que o cérebro humano processa imagens 60.000 vezes mais rápido que textos. Ter um logotipo profissional, criado com diretrizes geométricas rígidas, posiciona seu negócio instantaneamente acima da concorrência.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '200ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-colors duration-500">
                <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aumento de Ticket Médio</h3>
              <p className="text-gray-600 leading-relaxed">
                Empresas que investem em um design premium conseguem cobrar mais caro por seus serviços. Um design amador transmite insegurança. Já um design com harmonia aciona gatilhos de autoridade no subconsciente do seu cliente.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '300ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-500">
                <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Autoridade Absoluta</h3>
              <p className="text-gray-600 leading-relaxed">
                O <strong>Criador de Logomarca</strong> foi arquitetado para entregar não apenas uma imagem, mas um sistema visual coeso e de altíssima resolução, pronto para estampar sua fachada física e todo o ecossistema digital da sua marca.
              </p>
            </div>
          </div>
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
