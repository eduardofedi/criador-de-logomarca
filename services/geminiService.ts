import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogoFormData } from "../types";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateLogoImage(data: LogoFormData): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const prompt = `
Crie 1 logotipo profissional, comercial e facilmente aplicável para a marca ${data.name}, representando de forma clara e direta o nicho ${data.niche}. O estilo deve seguir a lógica de grandes estúdios de identidade visual brasileiros — como Oz Design, Ana Couto, Tátil Design e FutureBrand São Paulo — priorizando simplicidade inteligente, composição equilibrada e forte apelo de mercado.

O design deve ser funcional e versátil, adequado para empresas reais do Brasil: símbolo geométrico limpo, visual memorável, tipografia moderna, clara e de fácil leitura. Pode ser colorido, mas com paleta bem resolvida e harmoniosa. Evite experimentalismos, elementos caóticos, excesso de linhas, texturas ou abstrações confusas.

Estilo solicitado: ${data.style || "não especificado"}.
Cores desejadas: ${data.colors || "não especificadas"}.

Regras essenciais:
- Fundo sólido e limpo
- Nada de mockups, vitrines ou simulações
- Sem sombras exageradas, brilhos, reflexos ou efeitos 3D
- Símbolo + tipografia da marca ${data.name}
- Deve parecer um logo brasileiro autêntico, moderno e pronto para uso real em branding, embalagens, lojas, mídias sociais e impressos.
`;

  const result = await model.generateContent(prompt);

  const parts = result.response.candidates?.[0]?.content?.parts;
  const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

  if (!img) throw new Error("Falha ao gerar a imagem");

  return `data:image/png;base64,${img}`;
}
