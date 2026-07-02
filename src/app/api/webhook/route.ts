import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendLogoEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('asaas-access-token');
    
    // Validar token do webhook
    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event, payment } = body;

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const orderId = payment.externalReference;
      
      if (!orderId) {
        return NextResponse.json({ error: 'No orderId (externalReference) found' }, { status: 400 });
      }

      // Buscar pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, logos(svg_content)')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Se já estiver pago, ignora
      if (order.status === 'paid') {
        return NextResponse.json({ received: true, message: 'Already paid' });
      }

      // Atualizar status do pedido
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      // Enviar e-mail
      let svgContent = null;
      if (Array.isArray(order.logos)) {
        svgContent = order.logos[0]?.svg_content;
      } else {
        svgContent = order.logos?.svg_content;
      }

      if (svgContent) {
        try {
          await sendLogoEmail(order.email, svgContent);
          console.log('Email enviado com sucesso para', order.email);
        } catch (emailErr) {
          console.error('Erro ao enviar email:', emailErr);
        }
      } else {
        console.error('Logo SVG nao encontrado no pedido', orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
