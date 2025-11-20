import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API KEY missing" }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const imgText = result.response.text();

    return new Response(JSON.stringify({ image: imgText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to generate logo" }), { status: 500 });
  }
}
