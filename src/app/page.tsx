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
              Sua empresa com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">cara de negócio grande.</span>
            </h1>
            
            <h2 className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed font-normal">
              Passe mais confiança e atraia mais clientes com um logotipo profissional. Você digita o nome do seu negócio e nosso sistema cria uma marca linda, exclusiva e pronta para usar no WhatsApp, Instagram e na sua fachada.
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
              { step: "01", title: "Fale sobre seu negócio", desc: "Você só precisa digitar o nome da sua empresa e o que você faz (ex: mecânica, doceria, salão). É simples e rápido, sem complicação." },
              { step: "02", title: "Criação Automática", desc: "Nosso sistema inteligente faz todo o trabalho duro. Ele combina as melhores cores, letras e desenhos perfeitos para o seu negócio." },
              { step: "03", title: "Pronto para usar", desc: "Você baixa a imagem do seu logotipo em altíssima qualidade, prontinha para você colocar na placa da loja, no WhatsApp e no seu uniforme." }
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
      <section className="py-24 md:py-32 bg-gray-50/50 border-y border-gray-100 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">A Verdade Sobre Ferramentas Gratuitas</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
              "Por que não tentar fazer sozinho em outros sites?"
            </h2>
            <p className="text-gray-600 text-lg">Muitos tentam economizar usando robôs genéricos na internet e acabam perdendo tempo e paciência.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bad Card */}
            <div className="bg-white p-10 md:p-12 rounded-[2rem] border border-red-100 shadow-sm hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full blur-3xl -z-10 group-hover:bg-red-100 transition-colors duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-2xl mb-8 group-hover:scale-110 transition-transform duration-500">✕</div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">Outros sites entregam dor de cabeça</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                Os robôs gratuitos te entregam desenhos cheios de detalhes inúteis, textos escritos com "letras estranhas" e cores que ficam horríveis na hora de imprimir. Você não consegue usar no mundo real sem ter que pagar alguém para consertar o arquivo.
              </p>
            </div>
            
            {/* Good Card */}
            <div className="bg-white p-10 md:p-12 rounded-[2rem] border border-green-100 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-50 rounded-full blur-3xl -z-10 group-hover:bg-green-100 transition-colors duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black text-2xl mb-8 group-hover:scale-110 transition-transform duration-500">✓</div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">Nós entregamos a marca pronta</h4>
              <p className="text-gray-600 text-lg leading-relaxed">
                Nosso sistema foi criado para o dono de negócio. A ferramenta acerta o texto perfeitamente, usa contrastes corretos e entrega a imagem (PNG) já no formato ideal, pronta para usar na sua placa, cartão ou WhatsApp na mesma hora.
              </p>
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
            { name: "Carlos Souza", role: "Pizzaria Bella Italia", initials: "CS", color: "bg-red-50 text-red-600", text: "Tentei fazer sozinho em geradores gringos e as letras saíram todas tortas. Aqui saiu certinho o nome da pizzaria e o desenho ficou show. Já mandei pra gráfica!", rating: "★★★★★" },
            { name: "Dra. Mariana Costa", role: "Odontologia Integrada", initials: "MC", color: "bg-teal-50 text-teal-600", text: "Me poupou um dinheirão! Fui numa agência e me cobraram um absurdo. Em minutos eu fiz o logo do meu consultório aqui e ficou maravilhoso e profissional.", rating: "★★★★☆" },
            { name: "Marcos Lima", role: "Oficina AutoTech", initials: "ML", color: "bg-orange-50 text-orange-600", text: "O logotipo facilitou muito para eu fazer a fachada da oficina. Baixei na hora e mandei pro cara do adesivo. Rápido e prático pra quem tem comércio.", rating: "★★★★★" },
            { name: "Felipe Nunes", role: "Nunes Advocacia", initials: "FN", color: "bg-yellow-50 text-yellow-600", text: "Tentei fazer no Canva, mas ficava com cara de amador, igual a todo mundo. Queria algo mais sério pro meu escritório e o monograma aqui gerou algo único.", rating: "★★★★☆" },
            { name: "Juliana Rocha", role: "Studio Glow Estética", initials: "JR", color: "bg-pink-50 text-pink-600", text: "Fiz o logo para o meu salão de beleza. As cores ficaram super chiques. O arquivo PNG tem ótima qualidade, já estou usando no perfil do Instagram.", rating: "★★★★★" },
            { name: "Roberto Silva", role: "Iron Gym", initials: "RS", color: "bg-blue-50 text-blue-600", text: "Robusto e forte. Antes eu usava uma imagem que achei no Google e tava feio. Agora o escudo com as minhas iniciais ficou excelente para estampar nas camisetas.", rating: "★★★★★" },
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
              { q: "Vou receber o logotipo em qual formato?", a: "Você receberá o logotipo em formato de imagem de altíssima qualidade (PNG Premium - 2000x2000px). É perfeito para você colocar no Instagram, WhatsApp, mandar para a gráfica fazer panfletos ou colocar na fachada do seu comércio." },
              { q: "Por que não tentar fazer de graça em geradores de IA comuns?", a: "Se você pedir para robôs genéricos na internet, eles entregam imagens com 'letras tortas', cheias de borrões e que não servem para imprimir. Nosso sistema foi criado para corrigir isso e entregar o seu nome certinho, com qualidade de agência profissional." },
              { q: "Posso registrar a marca gerada?", a: "Sim! Ao comprar o logotipo, ele é totalmente seu. Você é o dono exclusivo da marca e pode usá-la em todos os seus materiais sem nenhuma restrição." },
              { q: "E se eu não gostar da primeira opção?", a: "Fique tranquilo! Você pode gerar até 3 opções totalmente gratuitas no nosso sistema. Assim você pode testar estilos diferentes até encontrar a que tem a cara do seu negócio." },
              { q: "Como funciona o pagamento?", a: "O pagamento é 100% seguro via PIX. Assim que você paga, na mesma hora a imagem original sem a marca d'água é liberada na tela para você baixar no celular ou computador, e também enviamos uma cópia para o seu e-mail." }
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
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Pequenos Negócios</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
              Por que uma marca bem feita é o segredo para o seu comércio vender mais?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              No mercado competitivo de hoje, não basta apenas ter um bom serviço. A primeira coisa que o cliente repara é a aparência da sua empresa.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chega de "Letra de Robô"</h3>
              <p className="text-gray-600 leading-relaxed">
                Tentar economizar usando robôs soltos na internet sempre resulta em imagens tortas que o cara da gráfica não consegue imprimir. Nossa plataforma é calibrada para entregar o seu texto de forma nítida, criando um logotipo que você tem orgulho de usar.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '200ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-colors duration-500">
                <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aumenta o Valor Cobrado</h3>
              <p className="text-gray-600 leading-relaxed">
                Empresas com fachadas e panfletos bonitos conseguem cobrar mais pelos seus produtos. Um visual feio passa insegurança para o cliente. Quando você usa uma marca bem construída, as pessoas sentem que sua empresa é confiável e levam o seu negócio a sério.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '300ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-500">
                <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Feito para Pequenos Negócios</h3>
              <p className="text-gray-600 leading-relaxed">
                O <strong>Criador de Logomarca</strong> entende a sua correria. Não é preciso baixar programas pesados ou ter conhecimento em computador. Em minutos, você resolve a identidade visual da sua lanchonete, oficina ou loja com um custo acessível que cabe no bolso do MEI.
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
