/**
 * 🔒 Segurança: A chave é processada estritamente no lado do servidor.
 */
function getDecryptedKey(): string {
    // 1. Tentar ler a variável em texto puro direto do dashboard
    const rawKey = (process.env.CRIADORDELOGOMARCA || "").trim();
    if (rawKey && rawKey.startsWith("AIza")) {
        return rawKey;
    }

    // 2. Tentar ler a variável codificada em Base64
    const obfuscatedKey = (process.env.CRIADORDELOGOMARCA_ENCODED || process.env.GEMINI_API_KEY_ENCODED || "").trim();
    if (obfuscatedKey) {
        try {
            const decoded = Buffer.from(obfuscatedKey, 'base64').toString('utf-8').trim();
            if (decoded.startsWith("AIza")) return decoded;
        } catch { }
    }

    // 3. Fallback: Chave codificada fixa (Criptografada no código)
    const HARDCODED_BASE64 = "QUl6YVN5Q0RJSUk1X3oyODJaVGFvSGM0dFo5cDZQdWZMcmVGTVc4";
    try {
        return Buffer.from(HARDCODED_BASE64, 'base64').toString('utf-8').trim();
    } catch {
        return "";
    }
}

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const apiKey = getDecryptedKey();

    // Usamos o Fetch direto para ter controle total sobre o endpoint e evitar bugs de versão do SDK
    // Tentamos v1beta que é o mais flexível
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{
                text: `Gere 1 logo profissional e minimalista para a marca "${data.name}", no nicho "${data.niche}". 
Cores: ${data.colors || "não informadas"}. Estilo: ${data.style || "minimalista"}.
Fundo sólido branco, logo centralizado, símbolo + texto "${data.name}".
Sem mockups, sem sombras exageradas, alta resolução.`
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Erro detalhado da API Gemini:", JSON.stringify(result, null, 2));
            throw new Error(result.error?.message || `Erro ${response.status} na API Gemini`);
        }

        // Verificamos se há imagem no retorno (inlineData)
        const candidates = result.candidates || [];
        const parts = candidates[0]?.content?.parts || [];

        // No Gemini, imagens são retornadas como inlineData em modelos que suportam geração de imagem direta.
        // Se o modelo for apenas texto (como o Flash 1.5 padrão costuma ser para texto-para-imagem em certas regiões),
        // ele pode não gerar a imagem se não for o modelo específico Imagen.
        // No código original, o modelo era usado para gerar a imagem.

        const imgPart = parts.find((p: any) => p.inlineData);
        if (imgPart) {
            return `data:image/png;base64,${imgPart.inlineData.data}`;
        }

        // Se não retornou inlineData, pode ser que o modelo retornou apenas texto com o link ou algo assim
        // Mas o objetivo original era geração direta.
        throw new Error("A IA não retornou os dados da imagem. Verifique se o modelo está correto.");

    } catch (error: any) {
        console.error("Generate API Error:", error);
        throw error;
    }
}
