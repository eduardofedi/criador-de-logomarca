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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
      <article className="max-w-3xl mx-auto bg-gray-950 p-8 md:p-12 rounded-3xl border border-gray-900 shadow-2xl">
        <Link href="/blog" className="text-blue-500 hover:text-blue-400 font-semibold transition mb-8 inline-block">
          ← Todos os artigos
        </Link>
        <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white">{post.title}</h1>
        <div 
          className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </main>
  );
}
