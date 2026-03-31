import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { companyName, briefingText } = await req.json();

        if (!companyName) {
            return NextResponse.json({ success: false, error: 'O nome da empresa é obrigatório.' }, { status: 400 });
        }

        // 0. Retention Policy: Cleanup older than 24h
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        await prisma.generation.deleteMany({
            where: { createdAt: { lt: yesterday } }
        });

        // 1. Initial DB record creation
        const generation = await prisma.generation.create({
            data: {
                companyName,
                briefingText,
                paymentStatus: 'PENDING'
            }
        });

        // Fetch Config (AI Keys)
        const config = await prisma.adminConfig.findUnique({ where: { id: 'global' } });
        const geminiKey = config?.geminiApiKey || process.env.CRIADORDELOGOMARCA;

        let styleStr = 'Moderno';
        let colorStr = '#1E3A8A e #FFFFFF';
        let typographyStr = 'Sans-serif geométrica';
        let artDirectionStr = 'Conceito abstrato minimalista e limpo, transmitindo profissionalismo.';
        let promptStr = '';
        let imageUrl = ''; // The SVG or generated Raster Image

        let costInBrl = 0;

        if (geminiKey) {
            try {
                const google = createGoogleGenerativeAI({ apiKey: geminiKey });
                // We use gemini-2.5-flash which is the standard hyper-fast model for current API keys.
                const customGoogle = google('gemini-2.5-flash');

                const userTemplate = `
Create a professional, high-end logo symbol based on the following creative briefing:

BRIEFING_ESTRUTURADO:
Company Name: "${companyName}"
Client Idea: "${briefingText}"

---
GOAL:
Design a timeless, globally competitive logo symbol that could belong to a major brand (e.g., Apple, Nike, FedEx, Ferrari). The result must be simple, memorable, scalable, and visually striking.

---
DESIGN PRINCIPLES (MANDATORY):
- Prioritize simplicity and clarity over complexity
- Ensure strong silhouette recognition (recognizable even in small sizes)
- Use clean geometry or refined organic shapes
- Apply balanced proportions and visual harmony
- Create a design that works in monochrome first
- Avoid unnecessary details, textures, or visual noise
- Ensure the symbol is versatile across digital and physical applications
- Focus on iconic, not illustrative design

---
VISUAL STYLE:
- modern, minimal, premium, strong brand identity
- intelligent use of negative space when applicable
- flat or subtly dimensional (no heavy gradients or realism)
- geometric precision or controlled organic flow

---
COMPOSITION RULES:
- centered composition
- isolated symbol (NO text included)
- clear structure and spacing
- strong contrast with background
- scalable and adaptable

---
COLOR DIRECTION:
- use a refined, limited palette (1-2 colors maximum)
- ensure it works perfectly in black and white
- CRITICAL: If no specific colors are requested in the Client Idea, automatically deduce the most psychological and appropriate colors based on the niche implied by the Company Name (e.g. Red/Orange for Pizzerias/Fast Food, Blue for Tech/Finance, Green for Nature/Health).

---
NEGATIVE PROMPT (STRICTLY AVOID):
- clipart style
- generic logo shapes
- overcomplicated details
- cartoonish or childish design
- random abstract without meaning
- stock icon appearance
- gradients excess
- shadows or 3D realism
- text, letters, or typography inside the symbol

---
QUALITY STANDARD:
This must NOT look like a generated image.
It must look like it was crafted by a senior brand designer.

---
OUTPUT REQUIREMENTS:
- clean solid white background
- high clarity
- centered symbol
- no noise or artifacts
`;

                const { object, usage } = await generateObject({
                    model: customGoogle,
                    schema: z.object({
                        estiloVisual: z.string(),
                        coresPrimares: z.string(),
                        tipografia: z.string(),
                        direcaoDeArte: z.string().describe('Explicação da composição visual'),
                        finalEnglishPrompt: z.string().describe('The final perfectly condensed 1-paragraph english prompt based on the template to be sent to an Image Generator Model (ex Midjourney/DALL-E). Must be incredibly descriptive, enforcing all negative and composition rules.')
                    }),
                    prompt: `Você é um Diretor de Arte Sênior. Sua missão é ler o briefing do cliente e preencher os dados visuais E construir um super prompt em INGLÊS que gerará a imagem perfeita seguindo estritamente as regras de design fornecidas:\n\n${userTemplate}`
                });

                styleStr = object.estiloVisual;
                colorStr = object.coresPrimares;
                typographyStr = object.tipografia;
                artDirectionStr = object.direcaoDeArte;
                promptStr = object.finalEnglishPrompt;

                // Step 2: Generate the REAL IMAGE natively using Google Imagen 4.0 !!
                const imgPrompt = promptStr + " minimalist, flat vector logo design, pure white background, dribbble, behance, award winning, high res, 8k";

                console.log("Generando imagem nativa via Imagen 4.0...");
                const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiKey}`;
                const imageResponse = await fetch(imagenUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: imgPrompt }],
                        parameters: { sampleCount: 1, aspectRatio: "1:1" }
                    })
                });

                if (imageResponse.ok) {
                    const jsonRes = await imageResponse.json();
                    if (jsonRes.predictions && jsonRes.predictions[0] && jsonRes.predictions[0].bytesBase64Encoded) {
                        imageUrl = 'data:image/jpeg;base64,' + jsonRes.predictions[0].bytesBase64Encoded;
                        console.log("Imagem Imagen 4.0 gerada com sucesso!");
                    } else {
                        throw new Error('Retorno inválido do Imagen: ' + JSON.stringify(jsonRes));
                    }
                } else {
                    throw new Error('Falha na API Imagen: ' + await imageResponse.text());
                }

                // Calculate cost based on Google Vertex AI / Gemini API public pricing
                // gemini-1.5-pro: ~$1.25/1M input, ~$5.00/1M output. USD to BRL ~5.20
                const usageData = usage as { promptTokens?: number; completionTokens?: number };
                const inputCostBRL = ((usageData?.promptTokens || 0) / 1000000) * 1.25 * 5.20;
                const outputCostBRL = ((usageData?.completionTokens || 0) / 1000000) * 5.00 * 5.20;
                costInBrl = Number((inputCostBRL + outputCostBRL).toFixed(4));

            } catch (aiErr) {
                console.error("AI Generation Error", aiErr);
            }
        } else {
            console.log('No Gemini API Key found. Using mock fallback outputs.');
            promptStr = `A premium logo symbol for ${companyName}. Geometric and modern.`;
            const svgMock = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="transparent" rx="40" />
          <circle cx="200" cy="200" r="120" fill="url(#grad)" opacity="0.9" />
          <text x="200" y="240" font-family="sans-serif" font-size="60" font-weight="bold" fill="#1E3A8A" text-anchor="middle">
            ${companyName.charAt(0).toUpperCase()}
          </text>
        </svg>`;
            imageUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgMock).toString('base64');
            costInBrl = 0;
        }

        // Final Update
        await prisma.generation.update({
            where: { id: generation.id },
            data: {
                style: styleStr,
                color: colorStr,
                typography: typographyStr,
                artDirection: artDirectionStr,
                imagePrompt: promptStr,
                base64Image: imageUrl,
                cost: costInBrl
            }
        });

        return NextResponse.json({ success: true, id: generation.id });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error generating logo:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
