import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt missing" }), { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API KEY missing" }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    const imgBase64 =
      result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;

    if (!imgBase64) {
      return new Response(JSON.stringify({ error: "No image generated" }), { status: 500 });
    }

    return new Response(JSON.stringify({
      image: `data:image/png;base64,${imgBase64}`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return new Response(JSON.stringify({ error: "Failed to generate logo" }), { status: 500 });
  }
}
