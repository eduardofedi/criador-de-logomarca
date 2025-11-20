// /api/webhook.js
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Memória temporária (funciona no Vercel)
const payments = {};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const notification = req.body;

    // Caso obrigatório do Mercado Pago
    if (!notification || !notification.type || notification.type !== "payment") {
      return res.status(200).json({ message: "Ignorado" });
    }

    const paymentId = notification.data.id;
    console.log("📩 Webhook recebeu pagamento:", paymentId);

    // Confirma o status real consultando o Mercado Pago
    const payment = await new Payment(client).get({ id: paymentId });

    console.log("💳 Status confirmado:", payment.status);

    // Guarda na memória temporária
    payments[paymentId] = payment.status;

    // Retorna ok
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}

// Exportar os pagamentos (para o frontend consultar)
export function getPaymentStatus(id) {
  return payments[id] || null;
}
