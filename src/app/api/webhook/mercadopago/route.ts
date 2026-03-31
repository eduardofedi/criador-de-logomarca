import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const type = url.searchParams.get('type') || (await req.json()).type;

        // Mercado Pago webhook standard body
        let data;
        try {
            // Body can be parsed if needed, MP sends { data: { id: "123" } }
            data = await req.json();
        } catch { }

        const paymentId = url.searchParams.get('data.id') || data?.data?.id;

        if (!paymentId || type !== 'payment') {
            return NextResponse.json({ status: 'ignored' }, { status: 200 });
        }

        // Verify token exists to fetch the real payment state
        const config = await prisma.adminConfig.findUnique({ where: { id: 'global' } });

        if (config?.mercadoPagoToken) {
            const client = new MercadoPagoConfig({ accessToken: config.mercadoPagoToken });
            const paymentApi = new Payment(client);
            const payment = await paymentApi.get({ id: paymentId });

            if (payment.status === 'approved' && payment.external_reference) {
                await prisma.generation.update({
                    where: { id: payment.external_reference },
                    data: { paymentStatus: 'APPROVED' }
                });
            }
        }

        return NextResponse.json({ status: 'ok' }, { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Webhook error:', err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
