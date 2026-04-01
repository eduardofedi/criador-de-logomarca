import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const key = (process.env.CRIADORDELOGOMARCA || "").trim();

    if (!key) {
        return NextResponse.json({ error: "Chave não encontrada no servidor" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, {
            cache: 'no-store'
        });
        const data = await response.json();

        return new NextResponse(JSON.stringify({
            timestamp: new Date().toISOString(),
            hasKey: true,
            keyPrefix: key.substring(0, 7),
            modelsResponse: data
        }), {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            timestamp: new Date().toISOString(),
            hasKey: true,
            error: error.message
        });
    }
}
