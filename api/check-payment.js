// /api/check-payment.js
import { MercadoPagoConfig, Payment } from "mercadopago";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "payment_id ausente" });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    // Consulta pagamento no SDK novo
    const result = await new Payment(client).get({ id });

    const status = result.response?.status ?? "pending";
    const detail = result.response?.status_detail ?? null;

    return res.status(200).json({
      id,
      status,
      detail,
    });

  } catch (err) {
    console.error("CHECK-PAYMENT ERRO:", err);

    // 🔥 SEMPRE RETORNAR JSON, NUNCA HTML
    return res.status(200).json({
      status: "pending",
      detail: "awaiting_confirmation",
    });
  }
}
