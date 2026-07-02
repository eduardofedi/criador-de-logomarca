import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Força revalidação instantânea (sem cache do servidor para testes)

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b border-gray-100 px-6 py-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-black text-gray-900 hover:text-blue-600 transition-colors">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">
            C
          </div>
          Criador de Logomarca
        </Link>
      </nav>
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/" className="inline-block mb-8 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
            ← Voltar para o gerador
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Nosso Blog</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Artigos, guias e estratégias de branding para destacar a sua marca no mercado e aumentar a percepção de valor do seu negócio.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post, idx) => (
            <article key={post.id} className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Branding</span>
                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-8 line-clamp-3">
                  {post.content.replace(/[#*_-]/g, '')}
                </p>
              </div>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 font-bold text-sm inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Ler artigo completo →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
