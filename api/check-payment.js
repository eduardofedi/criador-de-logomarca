// /api/check-payment.js
import { MercadoPagoConfig, Payment } from "mercadopago";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "payment_id ausente" });
    }

    // Configura client
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    // Consulta
    const result = await new Payment(client).get({ id });

    return res.status(200).json({
      status: result.status ?? "pending",
      detail: result.status_detail ?? null,
    });

  } catch (err) {
    console.error("CHECK-PAYMENT ERRO:", err);

    // 🔥 IMPORTANTE: SEMPRE RETORNAR JSON
    return res.status(200).json({
      status: "pending",
      detail: "awaiting_confirmation"
    });
  }
}
