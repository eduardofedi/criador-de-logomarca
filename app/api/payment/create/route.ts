import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const mpToken = process.env.MP_ACCESS_TOKEN;

        if (!mpToken) {
            return NextResponse.json({ error: "Mercado Pago token não configurado" }, { status: 500 });
        }

        const body = await req.json();

        const payload = {
            items: [
                {
                    title: "Licença de uso comercial - Logo PNG",
                    quantity: 1,
                    unit_price: 19.9,
                    currency_id: "BRL",
                },
            ],
            back_urls: {
                // Usando o host da requisição para redirecionamentos dinâmicos
                success: `${req.headers.get("origin") || "https://www.criadordelogomarca.com.br"}/?paid=true`,
                failure: `${req.headers.get("origin") || "https://www.criadordelogomarca.com.br"}/?paid=false`,
                pending: `${req.headers.get("origin") || "https://www.criadordelogomarca.com.br"}/?paid=pending`,
            },
            auto_return: "approved",
        };

        const responseMP = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mpToken}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await responseMP.json();

        if (!data.init_point) {
            return NextResponse.json({ error: "Resposta inválida do Mercado Pago", data }, { status: 500 });
        }

        return NextResponse.json({
            init_point: data.init_point,
            preference_id: data.id ?? null,
        });
    } catch (err) {
        console.error("Payment Creation Error:", err);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}
