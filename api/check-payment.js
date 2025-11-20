export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "payment_id ausente" });
    }

    const token = process.env.MP_ACCESS_TOKEN;

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await mpRes.json();

    // Se o MP retornar erro, devolve pending (evita quebrar o frontend)
    if (!data || data.error) {
      return res.status(200).json({
        status: "pending",
        detail: "awaiting_confirmation"
      });
    }

    return res.status(200).json({
      status: data.status, // approved, pending, rejected
      detail: data.status_detail
    });

  } catch (err) {
    console.error("CHECK PAYMENT ERROR:", err);

    return res.status(200).json({
      status: "pending",
      detail: "awaiting_confirmation"
    });
  }
}
