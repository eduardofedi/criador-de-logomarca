import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "payment_id ausente" }, { status: 400 });
        }

        const token = process.env.MP_ACCESS_TOKEN;

        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await mpRes.json();

        if (!data || data.error) {
            return NextResponse.json({
                status: "pending",
                detail: "awaiting_confirmation"
            });
        }

        return NextResponse.json({
            status: data.status, // approved, pending, rejected
            detail: data.status_detail
        });

    } catch (err) {
        console.error("CHECK PAYMENT ERROR:", err);
        return NextResponse.json({
            status: "pending",
            detail: "awaiting_confirmation"
        });
    }
}
