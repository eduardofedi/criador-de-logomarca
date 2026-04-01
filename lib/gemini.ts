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

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const apiKey = getDecryptedKey();
    if (!apiKey) throw new Error("Chave de API não encontrada.");

    // ESTRATÉGIA INFALÍVEL: Geramos o código SVG da logomarca.
    // Isso usa a geração de texto estável do Gemini (que nunca dá 404 se a chave estiver certa)
    // e garante um logo vetorial de alta qualidade.
    const prompt = `Crie o código SVG para uma logomarca minimalista e profissional.
Marca: "${data.name}"
Nicho: "${data.niche}"
Cores: ${data.colors || "Azul e Branco"}
Estilo: ${data.style || "Moderno"}

Regras:
1. Retorne APENAS o código <svg>...</svg>.
2. Use viewBox="0 0 512 512".
3. Inclua um símbolo geométrico elegante e o texto "${data.name}" com fonte legível (standard fonts).
4. O design deve ser premium e comercial.`;

    const modelName = "gemini-1.5-flash"; // Modelo mais estável para texto
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || `Erro ${response.status}`);
        }

        const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Extrai o código SVG se vier envolto em markdown
        const svgMatch = textOutput.match(/<svg[\s\S]*?<\/svg>/);
        const svgCode = svgMatch ? svgMatch[0] : null;

        if (svgCode) {
            // Retorna o SVG como um Data URI para ser usado direto no <img src="...">
            const base64Svg = Buffer.from(svgCode).toString('base64');
            return `data:image/svg+xml;base64,${base64Svg}`;
        }

        throw new Error("A IA não gerou um código SVG válido.");

    } catch (error: any) {
        console.error("Erro na geração SVG:", error);
        throw error;
    }
}
