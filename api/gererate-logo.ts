import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API KEY missing" });
    }

    const genai = new GoogleGenAI({ apiKey });
    const model = genai.getGenerativeModel({
      model: "gemini-2.5-flash-image"
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const parts = result.candidates?.[0]?.content?.parts;
    let base64 = parts?.find(p => p.inlineData)?.inlineData?.data;

    if (!base64) {
      return res.status(500).json({ error: "Model returned no image" });
    }

    res.status(200).json({
      image: `data:image/png;base64,${base64}`
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal error generating logo" });
  }
}
