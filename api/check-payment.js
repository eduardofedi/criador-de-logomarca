// /api/check-payment.js
import { MercadoPagoConfig, Payment } from "mercadopago";

export default async function handler(req, res) {
  try {
    const paymentId = req.query.id;

    if (!paymentId) {
      return res.status(400).json({ error: "payment_id ausente" });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    const payment = await new Payment(client).get({ id: paymentId });

    return res.status(200).json({
      id: paymentId,
      status: payment.status,              // approved, pending, rejected
      detail: payment.status_detail        // opcional
    });

  } catch (error) {
    console.error("Erro ao consultar pagamento:", error);
    return res.status(500).json({
      error: "Erro ao consultar pagamento"
    });
  }
}
