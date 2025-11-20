// /api/check-payment.js
import { getOrderStatus } from "./webhook";

export default async function handler(req, res) {
  try {
    const orderId = req.query.id;

    if (!orderId) {
      return res.status(400).json({ error: "merchant_order_id ausente" });
    }

    const status = getOrderStatus(orderId);

    return res.status(200).json({ status });

  } catch (error) {
    console.error("CHECK ERROR:", error);
    return res.status(200).json({ status: "pending" });
  }
}
