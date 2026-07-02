import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { parseMarkdown } from '@/lib/markdown';

export default async function BlogPost({ params }: any) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!post) notFound();

  const htmlContent = parseMarkdown(post.content);

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

      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link href="/blog" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mb-10">
          ← Voltar para o Blog
        </Link>
        
        <article className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-blue-900/5">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-12 leading-[1.1] text-gray-900 tracking-tight">{post.title}</h1>
          <div 
            className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-gray-900 prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </main>
  );
}
