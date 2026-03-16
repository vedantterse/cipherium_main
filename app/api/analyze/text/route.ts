import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { analyzeText } from "@/lib/ai/analyzer";
import { z } from "zod/v4";

const textSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text too long (max 10000 chars)"),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = textSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const result = await analyzeText(parsed.data.text);

    const record = db
      .insert(analyses)
      .values({
        userId: user.userId,
        type: "text",
        inputText: result.inputText,
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
    console.error("Text analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
