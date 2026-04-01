import { NextResponse } from "next/server";

export async function GET() {
    const key = process.env.CRIADORDELOGOMARCA || "";
    const keyEncoded = process.env.CRIADORDELOGOMARCA_ENCODED || "";
    const keyGemini = process.env.GEMINI_API_KEY_ENCODED || "";

    return NextResponse.json({
        hasKey: key.length > 0,
        keyPrefix: key ? key.substring(0, 7) : "N/A",
        keyLength: key.length,
        hasKeyEncoded: keyEncoded.length > 0,
        keyEncodedPrefix: keyEncoded ? keyEncoded.substring(0, 7) : "N/A",
        hasKeyGemini: keyGemini.length > 0,
        envKeys: Object.keys(process.env).filter(k => k.includes("LOGO") || k.includes("GEMINI"))
    });
}
