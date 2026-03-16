import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const analysisId = parseInt(id);

    if (isNaN(analysisId)) {
      return NextResponse.json({ error: "Invalid analysis ID" }, { status: 400 });
    }

    const record = db
      .select()
      .from(analyses)
      .where(and(eq(analyses.id, analysisId), eq(analyses.userId, user.userId)))
      .get();

    if (!record) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: record.id,
      type: record.type,
      inputText: record.inputText,
      originalFileName: record.originalFileName,
      filePath: record.filePath,
      imageData: record.imageData,
      audioTranscript: record.audioTranscript,
      detectedLanguage: record.detectedLanguage,
      riskLevel: record.riskLevel,
      riskScore: record.riskScore,
      scamPhrases: JSON.parse(record.scamPhrases || "[]"),
      suspiciousLinks: JSON.parse(record.suspiciousLinks || "[]"),
      manipulationTactics: JSON.parse(record.manipulationTactics || "[]"),
      aiSummary: record.aiSummary,
      createdAt: record.createdAt,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
