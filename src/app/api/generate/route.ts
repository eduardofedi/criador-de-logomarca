import { NextRequest, NextResponse } from 'next/server';
import { generateLogo, BrandBrief } from '@/lib/agents';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const brief: BrandBrief = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Verificação de Limite de IP (3 logos por IP - ignorado em localhost/desenvolvimento)
    // Cheat code: Se o nome da empresa tiver [ADMIN], ignora o limite.
    if (process.env.NODE_ENV !== 'development' && !brief.companyName.includes('[ADMIN]')) {
      const { data: countData, error: countError } = await supabase
        .from('logos')
        .select('id', { count: 'exact' })
        .eq('ip_address', ip);

      if (countData && countData.length >= 3) {
        return NextResponse.json({ error: 'Limite de 3 gerações por IP atingido.' }, { status: 429 });
      }
    }

    // 2. Geração via OpenAI
    const result = await generateLogo(brief);

    // 3. Salvar rascunho no Supabase (coluna brand_manual_content não é mais utilizada)
    const { data, error } = await supabase
      .from('logos')
      .insert({
        ip_address: ip,
        prompt_data: brief,
        svg_content: result.html,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      id: data.id,
      html: result.html,
      concept: result.concept
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
