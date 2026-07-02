import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendLogoEmail } from '@/lib/email';
import { ASAAS_API_KEY, ASAAS_BASE_URL } from '@/lib/asaas';

export async function POST(req: NextRequest) {
  try {
    const { paymentId, orderId } = await req.json();

    if (!paymentId || !orderId) {
      return NextResponse.json({ error: 'paymentId e orderId são obrigatórios' }, { status: 400 });
    }

    // Consultar o Asaas diretamente
    const res = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}`, {
      headers: {
        'access_token': ASAAS_API_KEY,
      },
      // Ensure no caching for this fetch
      cache: 'no-store',
    });

    const payment = await res.json();

    if (payment.status === 'RECEIVED' || payment.status === 'CONFIRMED') {
      // Buscar pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, logos(svg_content)')
        .eq('id', orderId)
        .single();

      if (!orderError && order && order.status !== 'paid') {
        // Atualizar status do pedido
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);

        // Enviar e-mail para garantir entrega imediata
        let svgContent = null;
        if (Array.isArray(order.logos)) {
          svgContent = order.logos[0]?.svg_content;
        } else {
          svgContent = order.logos?.svg_content;
        }

        if (svgContent) {
          try {
            await sendLogoEmail(order.email, svgContent);
          } catch (e) {
            console.error('Email error in manual check:', e);
          }
        }
      }

      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ paid: false, status: payment.status });
  } catch (error: any) {
    console.error('Check payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
