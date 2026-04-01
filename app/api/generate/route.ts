import { NextResponse } from "next/server";
import { generateLogoImage } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const imageData = await generateLogoImage(body);

        return NextResponse.json({ image: imageData });
    } catch (error: any) {
        console.error("Generate API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate logo" }, { status: 500 });
    }
}
