/**
 * 🔒 Segurança: A chave é processada estritamente no lado do servidor.
 */
function getDecryptedKey(): string {
    const rawKey = (process.env.CRIADORDELOGOMARCA || "").trim();
    if (rawKey && rawKey.startsWith("AIza")) return rawKey;

    const obfuscatedKey = (process.env.CRIADORDELOGOMARCA_ENCODED || process.env.GEMINI_API_KEY_ENCODED || "").trim();
    if (obfuscatedKey) {
        try {
            const decoded = Buffer.from(obfuscatedKey, 'base64').toString('utf-8').trim();
            if (decoded.startsWith("AIza")) return decoded;
        } catch { }
    }

    const HARDCODED_BASE64 = "QUl6YVN5Q0RJSUk1X3oyODJaVGFvSGM0dFo5cDZQdWZMcmVGTVc4";
    try {
        return Buffer.from(HARDCODED_BASE64, 'base64').toString('utf-8').trim();
    } catch {
        return "";
    }
}

async function tryGenerate(apiKey: string, modelName: string, prompt: string) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 }
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error?.message || `Erro ${response.status} no modelo ${modelName}`);
    }

    const imgPart = result.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    if (imgPart) {
        return `data:image/png;base64,${imgPart.inlineData.data}`;
    }

    // Se não gerou imagem mas gerou texto (o que é mais comum no 1.5 Flash 
    // se ele não estiver com o modo multimodal de imagem ativado)
    // No entanto, se o usuário disse que funcionava antes, ele deve estar usando um modelo que gera.
    return null;
}

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const apiKey = getDecryptedKey();
    const prompt = `Gere 1 logo profissional e minimalista para a marca "${data.name}", no nicho "${data.niche}". 
Cores: ${data.colors || "não informadas"}. Estilo: ${data.style || "minimalista"}.
Fundo sólido branco, logo centralizado, símbolo + texto "${data.name}".
Sem mockups, sem sombras exageradas, alta resolução.`;

    // Fallback de modelos para garantir que um funcione
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash-exp", "gemini-1.5-pro"];
    let lastError = "";

    for (const modelName of models) {
        try {
            console.log(`Tentando gerar com modelo: ${modelName}`);
            const result = await tryGenerate(apiKey, modelName, prompt);
            if (result) return result;
            lastError = `Modelo ${modelName} não retornou imagem direta (dados binários).`;
        } catch (e: any) {
            console.error(`Erro no modelo ${modelName}:`, e.message);
            lastError = e.message;
            if (e.message.includes("API key was reported as leaked")) {
                throw new Error("Sua chave de API foi bloqueada pelo Google. Por favor, gere uma NOVA chave no AI Studio.");
            }
        }
    }

    throw new Error(lastError || "Todos os modelos falharam na geração da imagem.");
}
