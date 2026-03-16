import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const AUDIO_DIR = path.join(UPLOADS_DIR, "audio");
const IMAGES_DIR = path.join(UPLOADS_DIR, "images");
for (const dir of [UPLOADS_DIR, AUDIO_DIR, IMAGES_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(path.join(DB_DIR, "cipherium.db"));
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
