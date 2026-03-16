import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const type = searchParams.get("type");
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: analyses.id,
        type: analyses.type,
        inputText: analyses.inputText,
        imageData: analyses.imageData,
        originalFileName: analyses.originalFileName,
        detectedLanguage: analyses.detectedLanguage,
        riskLevel: analyses.riskLevel,
        riskScore: analyses.riskScore,
        aiSummary: analyses.aiSummary,
        createdAt: analyses.createdAt,
      })
      .from(analyses)
      .where(eq(analyses.userId, user.userId))
      .orderBy(desc(analyses.createdAt))
      .limit(limit)
      .offset(offset);

    const rows = query.all();

    const totalResult = db
      .select({ count: sql<number>`count(*)` })
      .from(analyses)
      .where(eq(analyses.userId, user.userId))
      .get();

    const total = totalResult?.count || 0;

    return NextResponse.json({
      analyses: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("List analyses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
