import { NextResponse } from "next/server";

export async function GET() {
    const key = (process.env.CRIADORDELOGOMARCA || "").trim();

    if (!key) {
        return NextResponse.json({ error: "Chave não encontrada no servidor" });
    }

    try {
        // Tentamos listar os modelos para ver o que essa chave "enxerga"
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        return NextResponse.json({
            hasKey: true,
            keyPrefix: key.substring(0, 7),
            modelsResponse: data
        });
    } catch (error: any) {
        return NextResponse.json({
            hasKey: true,
            error: error.message
        });
    }
}
