import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogoFormData } from "../types";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateLogoImage(data: LogoFormData): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const prompt = `Gere 1 logo simples, nítido, profissional e minimalista para a marca ${data.name}, nicho ${data.niche}${styleText}${colorText}. Fundo sólido e limpo. Nada de mockups. O design deve ser simples, direto e comercial. Logo simples, minimalista, para uso geral, com fundo sólido, estilo profissional, sem mockups, sem sombras exageradas, apenas símbolo + texto da marca ${data.name} e sensação do nicho ${data.niche}. Deve parecer um logo comercial pronto para uso.`;
  
  const result = await model.generateContent(prompt);

  const parts = result.response.candidates?.[0]?.content?.parts;
  const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

  if (!img) throw new Error("Falha ao gerar a imagem");

  return `data:image/png;base64,${img}`;
}
