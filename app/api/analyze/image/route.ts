import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { analyzeImage } from "@/lib/ai/analyzer";
import path from "path";
import fs from "fs";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
      return NextResponse.json({ error: "Invalid image file type" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Save file
    const ext = path.extname(file.name) || ".png";
    const fileName = `${generateId()}${ext}`;
    const uploadsDir = path.join(process.cwd(), "uploads", "images");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const mimeType = file.type || "image/png";

    // Convert to base64 for storage
    const imageBase64 = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const result = await analyzeImage(buffer, mimeType);

    const record = db
      .insert(analyses)
      .values({
        userId: user.userId,
        type: "image",
        inputText: result.inputText,
        originalFileName: file.name,
        filePath: `uploads/images/${fileName}`,
        imageData: imageBase64,
        detectedLanguage: result.detectedLanguage,
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
        scamPhrases: JSON.stringify(result.scamPhrases),
        suspiciousLinks: JSON.stringify(result.suspiciousLinks),
        manipulationTactics: JSON.stringify(result.manipulationTactics),
        aiSummary: result.aiSummary,
        rawAiResponse: result.rawAiResponse,
      })
      .returning()
      .get();

    return NextResponse.json({
      analysisId: record.id,
      extractedText: result.inputText,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      detectedLanguage: result.detectedLanguage,
      aiSummary: result.aiSummary,
      scamPhrases: result.scamPhrases,
      suspiciousLinks: result.suspiciousLinks,
      manipulationTactics: result.manipulationTactics,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Image analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
