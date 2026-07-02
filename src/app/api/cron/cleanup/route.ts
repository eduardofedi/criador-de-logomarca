import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // Verificar se a requisição tem autorização (Vercel Cron usa um header específico ou podemos usar uma secret)
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // 1. Deletar ordens antigas (Cascade deleta os logos se configurado, senão deletamos manual)
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .lt('created_at', yesterday);

    if (orderError) throw orderError;

    // 2. Deletar logos antigos
    const { error: logoError } = await supabase
      .from('logos')
      .delete()
      .lt('created_at', yesterday);

    if (logoError) throw logoError;

    return NextResponse.json({ success: true, message: 'Limpeza de 24h concluída com sucesso.' });

  } catch (error: any) {
    console.error('Erro no Cleanup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
