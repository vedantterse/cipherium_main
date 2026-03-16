import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/middleware";
import { eq, and } from "drizzle-orm";
import path from "path";
import fs from "fs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const user = await requireAuth();

    const { filename } = await params;

    // Sanitize the filename to prevent path traversal
    const sanitized = path.basename(filename);

    // Verify ownership: ensure this audio file belongs to the authenticated user
    const record = db
      .select({ id: analyses.id })
      .from(analyses)
      .where(
        and(
          eq(analyses.userId, user.userId),
          eq(analyses.filePath, `uploads/audio/${sanitized}`)
        )
      )
      .get();

    if (!record) {
      return NextResponse.json({ error: "Audio file not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "uploads", "audio", sanitized);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Audio file not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(sanitized).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
      ".m4a": "audio/mp4",
      ".webm": "audio/webm",
      ".mp4": "audio/mp4",
    };
    const contentType = mimeTypes[ext] || "audio/mpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to serve audio file" }, { status: 500 });
  }
}
