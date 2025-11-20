import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API KEY missing" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const img = result.response.text();

    return res.status(200).json({ image: img });
  } catch (err) {
    console.log("Gemini error:", err);
    return res.status(500).json({ error: "Failed to generate logo" });
  }
}
