import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogoFormData } from "../types";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateLogoImage(data: LogoFormData): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const prompt = `
Crie 1 logotipo profissional, comercial e facilmente aplicável para a marca "${data.name}", representando de forma clara e direta o nicho "${data.niche}". 

O estilo deve respeitar exatamente a escolha do usuário: ${data.style || "não especificado"}.
Use como referência a lógica dos grandes estúdios brasileiros de identidade visual — Oz Design, Ana Couto, Tátil Design e FutureBrand São Paulo — priorizando simplicidade inteligente, composição equilibrada e apelo de mercado.

O design deve ser funcional, versátil e adequado a marcas reais do Brasil: símbolo geométrico limpo, visual memorável e tipografia moderna, clara e de fácil leitura. Pode ser colorido, desde que a paleta seja harmoniosa e bem resolvida. Evite experimentalismos exagerados, poluição visual, excesso de linhas, texturas ou abstrações difíceis de interpretar.

Cores desejadas pelo usuário: ${data.colors || "não especificadas"}.

Regras essenciais:
• Fundo sólido e limpo  
• Proibido mockups, vitrines ou simulações  
• Sem sombras pesadas, brilhos, reflexos, 3D ou efeitos artificiais  
• Deve sempre conter símbolo + tipografia da marca "${data.name}"  
• O resultado deve parecer um logotipo brasileiro autêntico, moderno e pronto para uso real em branding, embalagens, fachadas, mídias sociais e impressos.
`;
  
  const result = await model.generateContent(prompt);

  const parts = result.response.candidates?.[0]?.content?.parts;
  const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

  if (!img) throw new Error("Falha ao gerar a imagem");

  return `data:image/png;base64,${img}`;
}
