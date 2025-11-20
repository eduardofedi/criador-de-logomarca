import { GoogleGenAI } from "@google/genai";
import { LogoFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the prompt string based on user input.
 */
const constructPrompt = (data: LogoFormData): string => {
  const styleText = data.style ? `, estilo ${data.style}` : '';
  const colorText = data.colors ? `, usando as cores ${data.colors}` : '';
  
  // Base internal prompt structure as requested
  return `Gere 1 logo simples, nítido, profissional e minimalista para a marca ${data.name}, nicho ${data.niche}${styleText}${colorText}. Fundo sólido e limpo. Nada de mockups. O design deve ser simples, direto e comercial. Logo simples, minimalista, para uso geral, com fundo sólido, estilo profissional, sem mockups, sem sombras exageradas, apenas símbolo + texto da marca ${data.name} e sensação do nicho ${data.niche}. Deve parecer um logo comercial pronto para uso.`;
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