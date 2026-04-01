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
    // Usamos v1beta pois foi a que funcionou para listar os modelos
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
        throw new Error(`[${modelName}] ${result.error?.message || response.status}`);
    }

    const candidates = result.candidates || [];
    const parts = candidates[0]?.content?.parts || [];

    // Busca por dados de imagem
    const imgPart = parts.find((p: any) => p.inlineData);
    if (imgPart) {
        return `data:image/png;base64,${imgPart.inlineData.data}`;
    }

    // Se o modelo é o Gemini 2.0 ou 1.5, ele pode retornar a imagem em um formato específico ou só texto.
    // Se retornar só texto, não é a imagem.
    return null;
}

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const apiKey = getDecryptedKey();
    if (!apiKey) throw new Error("Chave de API não encontrada no servidor.");

    const prompt = `Gere 1 logo profissional e minimalista para a marca "${data.name}", no nicho "${data.niche}". 
Fundo sólido branco, logo centralizado, símbolo + texto "${data.name}".
Sem mockups, sem sombras exageradas, alta resolução.`;

    // Nomes de modelos EXATOS encontrados no seu listModels (Anexo 15)
    const models = [
        "gemini-2.0-flash", // Está na sua lista e é o mais moderno
        "gemini-1.5-flash",
        "gemini-2.5-flash", // Também está na sua lista!
        "gemini-1.5-pro"
    ];

    let errors: string[] = [];

    for (const modelName of models) {
        try {
            const result = await tryGenerate(apiKey, modelName, prompt);
            if (result) return result;
            errors.push(`${modelName}: Não gerou imagem.`);
        } catch (e: any) {
            errors.push(`${modelName}: ${e.message}`);
        }
    }

    // FALLBACK CRÍTICO: Se nenhum gerou imagem, pode ser que o Gemini agora exija Imagen para imagens.
    // Mas vindo do seu projeto Vite, o fluxo deveria ser este.
    throw new Error("Falha na geração: " + errors.join(" | "));
}
