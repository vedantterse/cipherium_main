import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireAuth();

    // Total scans
    const totalResult = db
      .select({ count: sql<number>`count(*)` })
      .from(analyses)
      .where(eq(analyses.userId, user.userId))
      .get();

    // Risk distribution
    const safeResult = db
      .select({ count: sql<number>`count(*)` })
      .from(analyses)
      .where(and(eq(analyses.userId, user.userId), eq(analyses.riskLevel, "safe")))
      .get();

    const suspiciousResult = db
      .select({ count: sql<number>`count(*)` })
      .from(analyses)
      .where(and(eq(analyses.userId, user.userId), eq(analyses.riskLevel, "suspicious")))
      .get();

    const highRiskResult = db
      .select({ count: sql<number>`count(*)` })
      .from(analyses)
      .where(and(eq(analyses.userId, user.userId), eq(analyses.riskLevel, "high_risk")))
      .get();

    // Average risk score
    const avgResult = db
      .select({ avg: sql<number>`avg(risk_score)` })
      .from(analyses)
      .where(eq(analyses.userId, user.userId))
      .get();

    // Daily activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyActivity = db
      .select({
        date: sql<string>`date(created_at)`,
        count: sql<number>`count(*)`,
      })
      .from(analyses)
      .where(
        and(
          eq(analyses.userId, user.userId),
          gte(analyses.createdAt, sevenDaysAgo.toISOString())
        )
      )
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`)
      .all();

    const totalScans = totalResult?.count || 0;
    const safeCount = safeResult?.count || 0;
    const suspiciousCount = suspiciousResult?.count || 0;
    const highRiskCount = highRiskResult?.count || 0;
    const threatsDetected = suspiciousCount + highRiskCount;

    return NextResponse.json({
      totalScans,
      threatsDetected,
      safeCount,
      avgRiskScore: Math.round(avgResult?.avg || 0),
      riskDistribution: {
        safe: safeCount,
        suspicious: suspiciousCount,
        high_risk: highRiskCount,
      },
      dailyActivity,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
