export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: "Logo profissional",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 19.9,
          },
        ],
        back_urls: {
          success: "https://criadordelogomarca.com.br/?paid=true",
          failure: "https://criadordelogomarca.com.br/?paid=false",
          pending: "https://criadordelogomarca.com.br/?paid=pending",
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    return res.status(200).json({ init_point: data.init_point });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}
