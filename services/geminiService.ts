import { GoogleGenAI } from "@google/genai";
import { LogoFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCaAC19IbNnR_EsNsAvce2HlxXyYVoKMMs" });

/**
 * Generates the prompt string based on user input.
 */
const constructPrompt = (data: LogoFormData): string => {
  const styleText = data.style ? `, estilo ${data.style}` : '';
  const colorText = data.colors ? `, usando as cores ${data.colors}` : '';
  
  // Base internal prompt structure as requested
  return `Crie 1 logotipo profissional, simples e memorável para a marca ${data.name}, refletindo o nicho ${data.niche}${styleText}${colorText}, com símbolo geométrico forte e atemporal no estilo Paul Rand / CGH / Vignelli, tipografia limpa, sem mockups ou efeitos, fundo sólido, totalmente legível em pequena escala e parecendo uma marca comercial real e pronta para uso.
`;
};

/**
 * Generates a logo using Google's GenAI models.
 * Updated to use gemini-2.5-flash-image via generateContent for better reliability.
 */
export const generateLogoImage = async (data: LogoFormData, highQuality: boolean = false): Promise<string> => {
  const prompt = constructPrompt(data);
  
  // Use gemini-2.5-flash-image as it is the standard for general image generation in the SDK
  const modelName = 'gemini-2.5-flash-image'; 

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      // gemini-2.5-flash-image defaults to 1:1 aspect ratio
    });

    let base64Image: string | undefined;
    
    // Iterate through parts to find the image part as per SDK guidelines
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }
    
    if (!base64Image) {
      // Check if there's a text refusal or error explanation in the response
      const textPart = parts?.find(p => p.text)?.text;
      if (textPart) {
        console.warn("Model returned text instead of image:", textPart);
      }
      throw new Error("Não foi possível gerar a imagem. Tente novamente.");
    }

    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Erro na geração da logo:", error);
    throw error;
  }
};
