// /api/webhook.js
import { MercadoPagoConfig, Payment, MerchantOrder } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// memória temporária
const orders = {};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const body = req.body;

    // Evento inválido
    if (!body || !body.type || body.type !== "payment") {
      return res.status(200).json({ ignored: true });
    }

    const paymentId = body.data.id;

    // Consulta pagamento real
    const payment = await new Payment(client).get({ id: paymentId });

    // Consulta order
    const order = await new MerchantOrder(client).get({ id: payment.order.id });

    const merchantOrderId = order.id;

    // SALVA STATUS REAL
    orders[merchantOrderId] = payment.status;

    console.log("Pagamento atualizado:", merchantOrderId, payment.status);

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).json({ ok: false });
  }
}

export function getOrderStatus(id) {
  return orders[id] || "pending";
}
