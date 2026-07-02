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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-400 font-semibold transition mb-8 inline-block">
          ← Voltar para o gerador
        </Link>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-center">Blog</h1>
        <p className="text-gray-400 text-center mb-16 max-w-md mx-auto text-sm">
          Artigos, guias e segredos de branding para destacar a sua marca no mercado.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {posts?.map((post) => (
            <article key={post.id} className="bg-gray-950 p-8 rounded-3xl border border-gray-900 hover:border-blue-500/30 transition flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Branding</span>
                <h2 className="text-2xl font-bold mt-2 mb-4 hover:text-blue-400 transition">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.content.replace(/[#*_-]/g, '')}
                </p>
              </div>
              <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:text-blue-400 font-semibold text-sm inline-block self-start">
                Ler artigo completo →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
