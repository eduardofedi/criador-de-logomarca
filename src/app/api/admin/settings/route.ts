import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: pricing } = await supabase.from('settings').select('*').eq('key', 'pricing').single();
  const { data: logos } = await supabase.from('logos').select('id', { count: 'exact' });
  const { data: paidLogos } = await supabase.from('logos').select('id', { count: 'exact' }).eq('status', 'paid');

  // Estimativa de custo baseada no gpt-image-2 + GPT-4o: ~$0.05 por geração
  const totalGenerations = logos?.length || 0;
  const estimatedCost = (totalGenerations * 0.05).toFixed(2);

  return NextResponse.json({
    price: pricing?.value?.logo_price || 49.90,
    stats: {
      totalGenerations,
      paidLogos: paidLogos?.length || 0,
      estimatedCost: `$${estimatedCost}`
    }
  });
}

export async function POST(req: NextRequest) {
  const { price } = await req.json();
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'pricing', value: { logo_price: price } });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
