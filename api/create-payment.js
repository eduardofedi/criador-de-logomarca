export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const mpToken = process.env.MP_ACCESS_TOKEN;

    if (!mpToken) {
      return res.status(500).json({ error: "Mercado Pago token não configurado" });
    }

    const payload = {
      items: [
        {
          title: "Licença de uso comercial - Logo PNG",
          quantity: 1,
          unit_price: 9.9,
          currency_id: "BRL",
        },
      ],
      back_urls: {
        success: "https://www.criadordelogomarca.com.br/?paid=true",
        failure: "https://www.criadordelogomarca.com.br/?paid=false",
        pending: "https://www.criadordelogomarca.com.br/?paid=pending",
      },
      auto_return: "approved",
    };

    const responseMP = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mpToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await responseMP.json();

    if (!data.init_point) {
      return res.status(500).json({
        error: "Resposta inválida do Mercado Pago",
        data,
      });
    }

    return res.status(200).json({
      init_point: data.init_point,
      preference_id: data.id ?? null,
    });

  } catch (err) {
    console.error("Erro no backend:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
