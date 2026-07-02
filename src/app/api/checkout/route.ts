import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createCustomer, createPixPayment, getPixQrCode } from '@/lib/asaas';

export async function POST(req: NextRequest) {
  try {
    const { logoId, email } = await req.json();

    if (!logoId || !email) {
      return NextResponse.json({ error: 'logoId and email are required' }, { status: 400 });
    }

    const price = 29.90;

    // 1. Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        logo_id: logoId,
        status: 'pending',
        price,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create customer in Asaas
    const customer = await createCustomer(email);

    // 3. Create PIX payment in Asaas
    const payment = await createPixPayment(customer.id, price, order.id);

    // 4. Get PIX QR Code payload
    const qrCode = await getPixQrCode(payment.id);

    return NextResponse.json({
      orderId: order.id,
      paymentId: payment.id,
      encodedImage: qrCode.encodedImage,
      payload: qrCode.payload,
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
