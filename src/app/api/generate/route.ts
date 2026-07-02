import { NextRequest, NextResponse } from 'next/server';
import { generateLogo, BrandBrief } from '@/lib/agents';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const brief: BrandBrief = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Verificação de Limite de IP (3 logos por IP - ignorado em localhost/desenvolvimento)
    // Lista de IPs liberados (Admin)
    const adminIPs = [
      '2804:14d:1897:80f4:7007:89cf:724f:20b3', 
      '179.232.216.5'
    ];
    
    const isAdmin = adminIPs.includes(ip);

    // 1. Rate Limiting (Bloqueio por IP, ignorando admin)
    if (!isAdmin) {
      const { data: usage } = await supabase
        .from('logos')
        .select('id')
        .eq('ip_address', ip)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (usage && usage.length >= 3) {
        return NextResponse.json({ 
          error: 'Limite diário atingido. Tente novamente amanhã.' 
        }, { status: 429 });
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
