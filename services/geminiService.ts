import { LogoFormData } from "../types";

/**
 * Monta o prompt final para gerar o logo.
 */
const constructPrompt = (data: LogoFormData): string => {
  const styleText = data.style ? `, estilo ${data.style}` : '';
  const colorText = data.colors ? `, usando as cores ${data.colors}` : '';

  return `Crie 1 logotipo profissional, simples e memorável para a marca ${data.name}, refletindo o nicho ${data.niche}${styleText}${colorText}, com símbolo geométrico forte e atemporal no estilo Paul Rand, Chermayeff & Geismar, Massimo Vignelli e Pentagram. Utilize composição minimalista, tipografia limpa, sem mockups ou efeitos, fundo sólido, totalmente legível em pequena escala e com aparência de marca comercial real e pronta para uso.`;
};

/**
 * Chama o backend protegido que gera a imagem com a Gemini.
 */
export const generateLogoImage = async (
  data: LogoFormData,
  highQuality: boolean = false
): Promise<string> => {
  const prompt = constructPrompt(data);

  const res = await fetch("/api/generate-logo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, highQuality }),
  });

  const json = await res.json();

  if (!json.image) {
    throw new Error("Falha ao gerar a imagem.");
  }

  return json.image; // já é um base64 pronto
};
