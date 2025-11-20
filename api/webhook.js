// /api/webhook.js
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const payments = {};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const notification = req.body;

    if (!notification?.type || notification.type !== "payment") {
      return res.status(200).json({ message: "Ignorado" });
    }

    const paymentId = notification.data.id;
    console.log("📩 Webhook recebeu pagamento:", paymentId);

    const result = await new Payment(client).get({ id: paymentId });

    const status = result.response?.status ?? "pending";
    console.log("💳 Status confirmado:", status);

    payments[paymentId] = status;

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}

export function getPaymentStatus(id) {
  return payments[id] || null;
}
