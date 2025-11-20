import Mercadopago from "mercadopago";

Mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { payment_id } = req.body;

    if (!payment_id) {
      return res.status(400).json({ error: "payment_id required" });
    }

    // Consulta a API oficial do MP
    const payment = await Mercadopago.payment.findById(payment_id);

    return res.status(200).json({
      status: payment.body.status,          // "approved", "pending", "rejected" etc
      detail: payment.body.status_detail,
    });

  } catch (error) {
    console.error("Erro ao consultar pagamento:", error);
    return res.status(500).json({ error: "Erro ao consultar pagamento" });
  }
}

import { getPaymentStatus } from "./webhook";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID não informado" });
  }

  const status = getPaymentStatus(id);

  return res.status(200).json({ status: status || "pending" });
}

