import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const generation = await prisma.generation.findUnique({
            where: { id },
        });

        if (!generation) {
            return NextResponse.json({ error: 'Logo não encontrado' }, { status: 404 });
        }

        // Return the config price dynamically
        const config = await prisma.adminConfig.findUnique({ where: { id: 'global' } });

        return NextResponse.json({
            success: true,
            generation,
            priceAmount: config?.priceAmount || 49.90
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
