import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 🔒 Segurança: A chave é armazenada de forma obfuscada para dificultar a exposição direta no código-fonte.
 * No entanto, por estar no lado do servidor (Next.js), ela já está muito mais segura que no Vite.
 */
function getDecryptedKey(): string {
    // O usuário solicitou que a chave "CRIADORDELOGOMARCA" (VITE_GEMINI_PUBLIC_KEY antiga) ficasse no código.
    // Substitua 'SUA_CHAVE_AQUI_EM_BASE64' pela sua chave Gemini em Base64.
    // Exemplo: se sua chave for AIza..., use btoa('AIza...') no console e cole aqui.

    const obfuscatedKey = process.env.CRIADORDELOGOMARCA_ENCODED || "";

    if (!obfuscatedKey) {
        // Fallback para desenvolvimento caso não queira usar env var nem no servidor
        // Para produção, recomenda-se usar a env var no Vercel mesmo no servidor.
        // Mas atendendo ao pedido, aqui está o local para a chave "fixa" obfuscada:
        const hardcodedObfuscated = "QUl6YVN5RHVlTGJfdktpT3VfX19fX19fX19fX19fX19fX19fXw=="; // PLACEHOLDER
        return Buffer.from(hardcodedObfuscated, 'base64').toString('utf-8');
    }

    return Buffer.from(obfuscatedKey, 'base64').toString('utf-8');
}

const genAI = new GoogleGenerativeAI(getDecryptedKey());

export async function generateLogoImage(data: { name: string, niche: string, style?: string, colors?: string }): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Atualizado para a versão mais comum e estável
    });

    const prompt = `Gere 1 logo simples, nítido, profissional e minimalista para a marca "${data.name}", 
no nicho "${data.niche}". 
Estilo visual desejado: ${data.style || "não informado"}. 
Cores desejadas: ${data.colors || "não informadas"}.

Fundo sólido e limpo, sem mockups, sem sombras exageradas, sem efeitos.  
O design deve ser comercial, direto e fácil de aplicar em qualquer contexto.  
Use símbolo + texto da marca "${data.name}", transmitindo claramente o nicho "${data.niche}".  
O resultado deve parecer um logo real pronto para uso.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Note: Gemini API standard output for images is via certain parts, 
    // but if it's returning text with image data, we handle it appropriately.
    // Based on original code:
    const parts = response.candidates?.[0]?.content?.parts;
    const img = parts?.find((p: any) => p.inlineData)?.inlineData?.data;

    if (!img) throw new Error("Falha ao gerar a imagem");

    return `data:image/png;base64,${img}`;
}
