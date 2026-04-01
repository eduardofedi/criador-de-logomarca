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
    // Tentamos v1 que é o mais estável para modelos 1.5
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
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

    // Buscamos qualquer dado de imagem (inlineData) ou texto que possa conter a URL
    const candidates = result.candidates || [];
    const parts = candidates[0]?.content?.parts || [];

    const imgPart = parts.find((p: any) => p.inlineData);
    if (imgPart) {
        return `data:image/png;base64,${imgPart.inlineData.data}`;
    }

    // Se o modelo retornou texto ao invés de imagem, vamos logar isso
    if (parts[0]?.text) {
        console.log(`Modelo ${modelName} retornou texto:`, parts[0].text.substring(0, 50));
        // Se a IA retornou só texto, ela não gerou a imagem. 
        // Talvez o modelo não suporte geração de imagem direta.
    }

    return null;
}

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const apiKey = getDecryptedKey();
    if (!apiKey) throw new Error("Chave de API não encontrada no servidor.");

    const prompt = `Gere 1 logo profissional e minimalista para a marca "${data.name}", no nicho "${data.niche}". 
Fundo sólido branco, logo centralizado, símbolo + texto "${data.name}".
Sem mockups, sem sombras exageradas, alta resolução.`;

    // Aumentamos o leque de modelos e tentamos nomes alternativos
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    let errors: string[] = [];

    for (const modelName of models) {
        try {
            const result = await tryGenerate(apiKey, modelName, prompt);
            if (result) return result;
            errors.push(`${modelName}: Não retornou imagem.`);
        } catch (e: any) {
            errors.push(`${modelName}: ${e.message}`);
        }
    }

    throw new Error("Falha geral: " + errors.join(" | "));
}
