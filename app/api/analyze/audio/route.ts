import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { analyzeAudio } from "@/lib/ai/analyzer";
import path from "path";
import fs from "fs";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const validTypes = [
      "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg",
      "audio/m4a", "audio/mp4", "audio/webm", "audio/x-m4a",
      "audio/mpeg3", "audio/x-wav",
    ];

    if (!validTypes.some((t) => file.type.startsWith("audio/") || file.name.match(/\.(mp3|wav|ogg|m4a|webm|mp4)$/i))) {
      return NextResponse.json({ error: "Invalid audio file type" }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
    }

    // Save file
    const ext = path.extname(file.name) || ".mp3";
    const fileName = `${generateId()}${ext}`;
    const uploadsDir = path.join(process.cwd(), "uploads", "audio");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const result = await analyzeAudio(buffer, file.name);

    const record = db
      .insert(analyses)
      .values({
        userId: user.userId,
        type: "audio",
        inputText: result.inputText,
        originalFileName: file.name,
        filePath: `uploads/audio/${fileName}`,
        audioTranscript: result.inputText,
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
      transcription: result.inputText,
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
    console.error("Audio analysis error:", error);
    return NextResponse.json(
      { error: "Audio analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
