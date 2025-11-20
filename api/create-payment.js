import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: "Download Logomarca em Alta",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 9.9,
        },
      ],

      // 🔥 ESSA PARTE AQUI ESTAVA FALTANDO 🔥
      back_urls: {
        success: "https://www.criadordelogomarca.com.br/?paid=true",
        failure: "https://www.criadordelogomarca.com.br/?paid=false",
        pending: "https://www.criadordelogomarca.com.br/?paid=pending",
      },

      auto_return: "approved",

      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
    });

    return res.status(200).json({
      init_point: preference.body.init_point,
    });
  } catch (error) {
    console.error("ERRO MERCADO PAGO:", error);
    return res.status(500).json({ error: "Erro no MP" });
  }
}
