import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogoFormData } from "../types";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateLogoImage(data: LogoFormData): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const prompt = `Crie 1 logotipo profissional, simples e memorável para a marca ${data.name}. 
O logo deve transmitir claramente o nicho: ${data.niche}${styleText}${colorText}.

Siga princípios de mestres do design como Paul Rand, Chermayeff & Geismar & Haviv, 
Saul Bass, Massimo Vignelli e Pentagram:

- Logo minimalista e altamente legível.
- Símbolo forte, geométrico e reconhecível instantaneamente.
- Design atemporal, evitando estilos datados ou modismos.
- Construção visual baseada em formas simples e consistentes.
- Relacionar o símbolo ao nicho ${data.niche} de forma inteligente, não literal.
- Tipografia limpa, sólida e equilibrada com o símbolo.
- Deve funcionar perfeitamente em preto e branco, pequena escala e impressão.
- Nada de mockups, efeitos 3D, brilhos, sombras exageradas ou texturas.
- Fundo sólido e neutro.
- Apenas símbolo + nome da marca (${data.name}).
- Entregar aparência de um logo comercial pronto para uso real, direto e profissional.

O resultado final deve parecer criado por um estúdio líder mundial de branding, 
com foco em clareza, simplicidade e impacto.`;

  const result = await model.generateContent(prompt);

  const parts = result.response.candidates?.[0]?.content?.parts;
  const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

  if (!img) throw new Error("Falha ao gerar a imagem");

  return `data:image/png;base64,${img}`;
}
