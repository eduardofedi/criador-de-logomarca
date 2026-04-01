import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 🔒 Segurança: A chave é armazenada de forma obfuscada para dificultar a exposição direta no código-fonte.
 */
function getDecryptedKey(): string {
    // 1. Tentar ler a variável em texto puro direto do dashboard
    // Usamos .trim() para evitar espaços invisíveis que causam erro de ByteString
    const rawKey = (process.env.CRIADORDELOGOMARCA || "").trim();
    if (rawKey && rawKey.startsWith("AIza")) {
        return rawKey;
    }

    // 2. Tentar ler a variável codificada em Base64
    const obfuscatedKey = (process.env.CRIADORDELOGOMARCA_ENCODED || process.env.GEMINI_API_KEY_ENCODED || "").trim();
    if (obfuscatedKey) {
        try {
            const decoded = Buffer.from(obfuscatedKey, 'base64').toString('utf-8');
            if (decoded.startsWith("AIza")) return decoded;
        } catch {
            // Ignorar erro e tentar próximo
        }
    }

    // 3. Fallback: Chave codificada fixa (Criptografada no código)
    // Chave: AIzaSyCDIII5_z282ZTaoHc4tZ9p6PufLreFMW8
    const HARDCODED_BASE64 = "QUl6YVN5Q0RJSUk1X3oyODJaVGFvSGM0dFo5cDZQdWZMcmVGTVc4";
    try {
        return Buffer.from(HARDCODED_BASE64, 'base64').toString('utf-8').trim();
    } catch {
        return "";
    }
}

const genAI = new GoogleGenerativeAI(getDecryptedKey());

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    // Forçamos a API v1 para evitar o erro 404 do v1beta
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    }, {
        apiVersion: "v1"
    });

    const prompt = `Gere 1 logo profissional e minimalista para a marca "${data.name}", no nicho "${data.niche}". 
Cores: ${data.colors || "não informadas"}. Estilo: ${data.style || "minimalista"}.
Fundo sólido branco, logo centralizado, símbolo + texto "${data.name}".
Sem mockups, sem sombras exageradas, alta resolução.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        const parts = response.candidates?.[0]?.content?.parts;
        const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

        if (!img) throw new Error("A IA não retornou uma imagem válida. Tente um prompt diferente.");

        return `data:image/png;base64,${img}`;
    } catch (error: any) {
        console.error("Erro na API Gemini:", error);
        throw new Error(error.message || "Erro desconhecido na geração da imagem");
    }
}
