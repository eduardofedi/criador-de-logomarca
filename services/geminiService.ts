import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogoFormData } from "../types";

const apiKey = (process as any).env.CRIADORDELOGOMARCA;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateLogoImage(data: LogoFormData): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-image-preview",
  });

  const prompt = `Gere 1 logo simples, nítido, profissional e minimalista para a marca "${data.name}", 
no nicho "${data.niche}". 
Estilo visual desejado: ${data.style || "não informado"}. 
Cores desejadas: ${data.colors || "não informadas"}.

Fundo sólido e limpo, sem mockups, sem sombras exageradas, sem efeitos.  
O design deve ser comercial, direto e fácil de aplicar em qualquer contexto.  
Use símbolo + texto da marca "${data.name}", transmitindo claramente o nicho "${data.niche}".  
O resultado deve parecer um logo real pronto para uso.`;

  const result = await model.generateContent(prompt);

  const parts = result.response.candidates?.[0]?.content?.parts;
  const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

  if (!img) throw new Error("Falha ao gerar a imagem");

  return `data:image/png;base64,${img}`;
}
