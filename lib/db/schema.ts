import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const analyses = sqliteTable("analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(), // "text" | "audio" | "image"
  inputText: text("input_text"),
  originalFileName: text("original_file_name"),
  filePath: text("file_path"),
  // Store original content for history display
  imageData: text("image_data"), // Base64 encoded image for screenshots
  audioTranscript: text("audio_transcript"), // Transcript for audio files
  detectedLanguage: text("detected_language"),
  riskLevel: text("risk_level").notNull(), // "safe" | "suspicious" | "high_risk"
  riskScore: real("risk_score").notNull(),
  scamPhrases: text("scam_phrases"), // JSON string
  suspiciousLinks: text("suspicious_links"), // JSON string
  manipulationTactics: text("manipulation_tactics"), // JSON string
  aiSummary: text("ai_summary"),
  rawAiResponse: text("raw_ai_response"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
