import { NextRequest, NextResponse } from 'next/server';
import { sendLogoEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get('email') || 'edufedi98@hotmail.com';

    // 1. Pegar o último pedido que tem logo (para testar o anexo real)
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, logos(svg_content)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Nenhum pedido encontrado para testar', details: error });
    }

    let logoData = null;
    if (Array.isArray(order.logos)) {
      logoData = order.logos[0]?.svg_content;
    } else {
      logoData = order.logos?.svg_content;
    }

    if (!logoData) {
      return NextResponse.json({ error: 'Pedido encontrado, mas sem logoData', orderId: order.id });
    }

    // 2. Tentar enviar o e-mail
    await sendLogoEmail(targetEmail, logoData);

    return NextResponse.json({ 
      success: true, 
      message: `E-mail de teste enviado com sucesso para ${targetEmail}`,
      orderId: order.id
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Falha ao enviar e-mail', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
