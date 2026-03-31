import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.adminConfig.upsert({
            where: { id: 'global' },
            update: {},
            create: {
                id: 'global',
                priceAmount: 49.90,
            }
        });

        const logs = await prisma.generation.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ config, logs });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const config = await prisma.adminConfig.upsert({
            where: { id: 'global' },
            update: {
                priceAmount: body.priceAmount,
                geminiApiKey: body.geminiApiKey || null,
                mercadoPagoToken: body.mercadoPagoToken || null,
            },
            create: {
                id: 'global',
                priceAmount: body.priceAmount,
                geminiApiKey: body.geminiApiKey || null,
                mercadoPagoToken: body.mercadoPagoToken || null,
            }
        });

        return NextResponse.json({ success: true, config });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
