module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const prismaClientSingleton = ()=>{
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
const __TURBOPACK__default__export__ = prisma;
if ("TURBOPACK compile-time truthy", 1) globalThis.prismaGlobal = prisma;
}),
"[project]/src/app/api/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/google/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
;
;
async function POST(req) {
    try {
        const { companyName, briefingText } = await req.json();
        if (!companyName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'O nome da empresa é obrigatório.'
            }, {
                status: 400
            });
        }
        // 0. Retention Policy: Cleanup older than 24h
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].generation.deleteMany({
            where: {
                createdAt: {
                    lt: yesterday
                }
            }
        });
        // 1. Initial DB record creation
        const generation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].generation.create({
            data: {
                companyName,
                briefingText,
                paymentStatus: 'PENDING'
            }
        });
        // Fetch Config (AI Keys)
        const config = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminConfig.findUnique({
            where: {
                id: 'global'
            }
        });
        const geminiKey = config?.geminiApiKey || process.env.GEMINI_API_KEY;
        let styleStr = 'Moderno';
        let colorStr = '#1E3A8A e #FFFFFF';
        let typographyStr = 'Sans-serif geométrica';
        let artDirectionStr = 'Conceito abstrato minimalista e limpo, transmitindo profissionalismo.';
        let promptStr = '';
        let imageUrl = ''; // The SVG or generated Raster Image
        let costInBrl = 0;
        if (geminiKey) {
            try {
                const google = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGoogleGenerativeAI"])({
                    apiKey: geminiKey
                });
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
                const { object, usage } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateObject"])({
                    model: customGoogle,
                    schema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                        estiloVisual: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
                        coresPrimares: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
                        tipografia: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
                        direcaoDeArte: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('Explicação da composição visual'),
                        finalEnglishPrompt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The final perfectly condensed 1-paragraph english prompt based on the template to be sent to an Image Generator Model (ex Midjourney/DALL-E). Must be incredibly descriptive, enforcing all negative and composition rules.')
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
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        instances: [
                            {
                                prompt: imgPrompt
                            }
                        ],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: "1:1"
                        }
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
                const usageData = usage;
                const inputCostBRL = (usageData?.promptTokens || 0) / 1000000 * 1.25 * 5.20;
                const outputCostBRL = (usageData?.completionTokens || 0) / 1000000 * 5.00 * 5.20;
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].generation.update({
            where: {
                id: generation.id
            },
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            id: generation.id
        });
    } catch (error) {
        console.error('Error generating logo:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__01srpzd._.js.map