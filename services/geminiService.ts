import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogoFormData } from "../types";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateLogoImage(data: LogoFormData): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const prompt = `
Crie 1 logotipo profissional e comercial para a marca ${data.name}, refletindo claramente o nicho ${data.niche}, no estilo moderno e funcional de estúdios clássicos como Rand, Vignelli e CGH. Use composição simples com símbolo geométrico marcante e tipografia limpa. Estilo: ${data.style || "não especificado"}. Cores: ${data.colors || "não especificadas"}. Fundo sólido, sem mockups, sem efeitos, sem sombras. O resultado deve parecer um logo real pronto para uso em branding.
`;

  const result = await model.generateContent(prompt);

  const parts = result.response.candidates?.[0]?.content?.parts;
  const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

  if (!img) throw new Error("Falha ao gerar a imagem");

  return `data:image/png;base64,${img}`;
}
