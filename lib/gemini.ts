import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 🔒 Segurança: A chave é armazenada de forma obfuscada para dificultar a exposição direta no código-fonte.
 * No entanto, por estar no lado do servidor (Next.js), ela já está muito mais segura que no Vite.
 */
function getDecryptedKey(): string {
    // 1. Tentar ler a variável em texto puro direto do dashboard (como mostrado no print)
    if (process.env.CRIADORDELOGOMARCA) {
        return process.env.CRIADORDELOGOMARCA;
    }

    // 2. Tentar ler a variável codificada em Base64
    const obfuscatedKey = process.env.CRIADORDELOGOMARCA_ENCODED || process.env.GEMINI_API_KEY_ENCODED;
    if (obfuscatedKey) {
        try {
            return Buffer.from(obfuscatedKey, 'base64').toString('utf-8');
        } catch {
            return obfuscatedKey; // Caso a pessoa tenha colocado texto puro mas na variável _ENCODED
        }
    }

    // Chave codificada fixa conforme solicitado (Criptografada no código)
    const HARDCODED_BASE64 = "QUl6YVN5Q0RJSUk1X3oyODJaVGFvSGM0dFo5cDZQdWZMcmVGTVc4";
    return Buffer.from(HARDCODED_BASE64, 'base64').toString('utf-8');
}

const genAI = new GoogleGenerativeAI(getDecryptedKey());

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    // Prompt otimizado para gerar imagem (inlineData)
    const prompt = `Gere 1 logo profissional e minimalista para a marca "${data.name}", no nicho "${data.niche}". 
Cores: ${data.colors || "não informadas"}. Estilo: ${data.style || "minimalista"}.
Fundo sólido branco, logo centralizado, símbolo + texto "${data.name}".
Sem mockups, sem sombras exageradas, alta resolução.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const parts = response.candidates?.[0]?.content?.parts;
    const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

    if (!img) throw new Error("Falha ao gerar a imagem no formato esperado");

    return `data:image/png;base64,${img}`;
}
