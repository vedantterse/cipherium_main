import Groq from "groq-sdk";
import { z } from "zod";
import { readFileSync, mkdirSync, rmSync, readdirSync } from "fs";
import { join } from "path";
import { SarvamAIClient } from "sarvamai";

const groq = new Groq();
const sarvam = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY!,
});

const reasonSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  evidence: z.array(z.string()),
});

const phishingAnalysisSchema = z.object({
  isScam: z.boolean(),
  riskLevel: z.enum(["safe", "suspicious", "high_risk"]),
  confidence: z.number(),
  summary: z.string(),
  redFlags: z.array(z.string()),
  reasons: z.array(reasonSchema),
  recommendedAction: z.string(),
});

type PhishingAnalysis = z.infer<typeof phishingAnalysisSchema>;

const SCHEMA_INSTRUCTIONS = `Return output strictly as valid JSON matching this exact schema:

{
  "isScam": boolean,
  "riskLevel": "safe" | "suspicious" | "high_risk",
  "confidence": number (0-100),
  "summary": string,
  "redFlags": string[],
  "reasons": [
    {
      "title": string,
      "explanation": string,
      "evidence": string[]
    }
  ],
  "recommendedAction": string
}

Return ONLY the raw JSON object. No markdown, no code fences, no extra text.`;

const BASE_INSTRUCTIONS = `You are a phishing and scam detection assistant specialized in chat-based social engineering analysis.

Your task:
- Analyze pasted conversation text, even if formatting is messy.
- Determine whether the content is likely safe, suspicious, or a phishing/scam attempt.
- Detect signals such as OTP requests, urgent payment demands, fake authority claims, account threats, impersonation, malicious links, emotional manipulation, or pressure tactics.
- Support multilingual input, including Indian regional languages where possible.
- Only cite evidence that appears exactly in the provided text.
- Do not invent lines, names, or events.`;

const TEXT_SYSTEM_PROMPT = `${BASE_INSTRUCTIONS}\n\n${SCHEMA_INSTRUCTIONS}`;

const IMAGE_SYSTEM_PROMPT = `${BASE_INSTRUCTIONS}
- You will receive a screenshot of a chat conversation. Read all visible messages carefully before analyzing.
- Extract the conversation text from the image first, then analyze it.

${SCHEMA_INSTRUCTIONS}`;

const landingHtml = readFileSync(join(import.meta.dir, "landing.html"), "utf-8");
const dashboardHtml = readFileSync(join(import.meta.dir, "dashboard.html"), "utf-8");

async function analyzeChat(chatText: string): Promise<PhishingAnalysis> {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "system", content: TEXT_SYSTEM_PROMPT },
      { role: "user", content: chatText },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]!.message.content || "{}";
  console.log("Raw AI response (text):", content);
  const raw = JSON.parse(content);
  return phishingAnalysisSchema.parse(raw);
}

async function analyzeChatImage(imageDataUrl: string): Promise<PhishingAnalysis> {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "system", content: IMAGE_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this chat screenshot for phishing or scam indicators." },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]!.message.content || "{}";
  console.log("Raw AI response (image):", content);
  const raw = JSON.parse(content);
  return phishingAnalysisSchema.parse(raw);
}

interface Utterance {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

interface TranscriptionResult {
  transcript: string;
  utterances: Utterance[];
  speakersDetected: number;
  languageCode: string | null;
  raw: any;
}

async function transcribeAudio(audioBuffer: ArrayBuffer, fileName: string): Promise<TranscriptionResult> {
  const tmpDir = join(import.meta.dir, ".tmp-audio");
  const outDir = join(import.meta.dir, ".tmp-output");
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const audioPath = join(tmpDir, fileName);
  await Bun.write(audioPath, audioBuffer);

  try {
    const job = await sarvam.speechToTextJob.createJob({
      model: "saaras:v3",
      languageCode: "unknown",
      withDiarization: true,
      numSpeakers: 2,
    });

    await job.uploadFiles([audioPath]);
    await job.start();
    await job.waitUntilComplete();

    const fileResults = await job.getFileResults();
    if (fileResults.failed.length > 0) {
      throw new Error(`Transcription failed: ${fileResults.failed[0]?.error_message}`);
    }
    if (fileResults.successful.length === 0) {
      throw new Error("Transcription returned no results");
    }

    await job.downloadOutputs(outDir);

    const outputFiles = readdirSync(outDir).filter(f => f.endsWith(".json"));
    if (outputFiles.length === 0) {
      throw new Error("No transcription output files found");
    }

    const out = JSON.parse(readFileSync(join(outDir, outputFiles[0]!), "utf-8"));
    console.log("Sarvam raw output keys:", Object.keys(out));
    console.log("Sarvam raw output:", JSON.stringify(out, null, 2));

    const transcript: string =
      out.transcript ?? out.text
      ?? out.results?.map((r: any) => r.transcript).join(" ")
      ?? JSON.stringify(out);

    let utterances: Utterance[] = [];

    // Sarvam diarized_transcript.entries format
    const entries = out.diarized_transcript?.entries;
    if (Array.isArray(entries) && entries.length > 0) {
      utterances = entries.map((e: any) => ({
        speaker: e.speaker_id ?? "0",
        start: e.start_time_seconds ?? 0,
        end: e.end_time_seconds ?? 0,
        text: e.transcript ?? "",
      }));
    }

    const speakerSet = new Set(utterances.map(u => u.speaker));
    const speakersDetected = out.num_speakers ?? out.speakers_detected ?? speakerSet.size;
    const languageCode = out.language_code ?? out.languageCode ?? out.language ?? null;

    return { transcript, utterances, speakersDetected, languageCode, raw: out };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
    rmSync(outDir, { recursive: true, force: true });
  }
}

interface AudioAnalysisResult {
  transcript: string;
  utterances: Utterance[];
  speakersDetected: number;
  languageCode: string | null;
  analysis: PhishingAnalysis;
}

async function analyzeAudio(audioBuffer: ArrayBuffer, fileName: string): Promise<AudioAnalysisResult> {
  const stt = await transcribeAudio(audioBuffer, fileName);
  const analysis = await analyzeChat(stt.transcript);
  return {
    transcript: stt.transcript,
    utterances: stt.utterances,
    speakersDetected: stt.speakersDetected,
    languageCode: stt.languageCode,
    analysis,
  };
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/back.mp4" && req.method === "GET") {
      const file = Bun.file(join(import.meta.dir, "back.mp4"));
      return new Response(file);
    }

    if (url.pathname === "/" && req.method === "GET") {
      return new Response(landingHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/dashboard" && req.method === "GET") {
      return new Response(dashboardHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/analyze" && req.method === "POST") {
      try {
        const body = (await req.json()) as { chatText?: string };
        const chatText = body.chatText?.trim();

        if (!chatText) {
          return Response.json({ error: "No chat text provided" }, { status: 400 });
        }

        const result = await analyzeChat(chatText);
        return Response.json(result);
      } catch (err: any) {
        console.error("Analysis error:", err);
        return Response.json(
          { error: err.message || "Analysis failed" },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/analyze-audio" && req.method === "POST") {
      try {
        const formData = await req.formData();
        const file = formData.get("audio") as File | null;

        if (!file) {
          return Response.json({ error: "No audio file provided" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const result = await analyzeAudio(buffer, file.name || "audio.mp3");
        return Response.json(result);
      } catch (err: any) {
        console.error("Audio analysis error:", err);
        return Response.json(
          { error: err.message || "Audio analysis failed" },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/analyze-image" && req.method === "POST") {
      try {
        const body = (await req.json()) as { imageDataUrl?: string };
        const imageDataUrl = body.imageDataUrl?.trim();

        if (!imageDataUrl) {
          return Response.json({ error: "No image provided" }, { status: 400 });
        }

        const result = await analyzeChatImage(imageDataUrl);
        return Response.json(result);
      } catch (err: any) {
        console.error("Image analysis error:", err);
        return Response.json(
          { error: err.message || "Image analysis failed" },
          { status: 500 }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Cipherium running at http://localhost:${server.port}`);
