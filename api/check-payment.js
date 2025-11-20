// /api/check-payment.js
import { MercadoPagoConfig, Payment } from "mercadopago";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const paymentId = req.query.id;

    if (!paymentId) {
      return res.status(400).json({ error: "payment_id ausente" });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: "MP_ACCESS_TOKEN não configurado" });
    }

    // Cliente Mercado Pago - modo compatível com Vercel
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
      options: {
        timeout: 5000,
      },
    });

    const mp = new Payment(client);

    let payment;
    try {
      payment = await mp.get({ id: paymentId });
    } catch (err) {
      console.error("Erro MP API ->", err?.message || err);
      return res.status(200).json({
        id: paymentId,
        status: "pending",
      });
    }

    return res.status(200).json({
      id: paymentId,
      status: payment.status,
      detail: payment.status_detail,
    });

  } catch (error) {
    console.error("Erro geral:", error);
    return res.status(500).json({ error: "Erro no check-payment" });
  }
}
