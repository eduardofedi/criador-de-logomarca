import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        const generation = await prisma.generation.findUnique({ where: { id } });
        if (!generation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const config = await prisma.adminConfig.findUnique({ where: { id: 'global' } });

        // Fallback/Mock for testing when no real MP Token exists
        if (!config?.mercadoPagoToken) {
            console.log('No MP Token configured. Simulating payment redirect.');

            // Simulate success approval background task
            setTimeout(async () => {
                await prisma.generation.update({
                    where: { id },
                    data: { paymentStatus: 'APPROVED' }
                });
            }, 2000);

            // Return a simulated URL
            const host = req.headers.get('host') || 'localhost:3000';
            const protocol = host.includes('localhost') ? 'http' : 'https';
            return NextResponse.json({ url: `${protocol}://${host}/checkout/success/${id}` });
        }

        // Real MP Flow
        const client = new MercadoPagoConfig({ accessToken: config.mercadoPagoToken, options: { timeout: 5000 } });
        const preference = new Preference(client);

        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: generation.id,
                        title: `Logomarca para ${generation.companyName}`,
                        quantity: 1,
                        unit_price: config.priceAmount,
                        currency_id: 'BRL',
                    }
                ],
                back_urls: {
                    success: `${protocol}://${host}/checkout/success/${id}`,
                    failure: `${protocol}://${host}/preview/${id}`,
                    pending: `${protocol}://${host}/preview/${id}`
                },
                auto_return: 'approved',
                external_reference: generation.id,
                notification_url: `${protocol}://${host}/api/webhook/mercadopago`, // Needs external URL obviously
            }
        });

        return NextResponse.json({ url: response.init_point });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Checkout error:', err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
