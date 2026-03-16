import { SarvamAIClient } from "sarvamai";
import { writeFileSync, mkdirSync, rmSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export interface TranscriptionResult {
  text: string;
  language: string;
}

interface Utterance {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

interface DetailedTranscriptionResult {
  transcript: string;
  utterances: Utterance[];
  speakersDetected: number;
  languageCode: string | null;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  fileName: string
): Promise<TranscriptionResult> {
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  const sarvam = new SarvamAIClient({
    apiSubscriptionKey: apiKey,
  });

  // Create temp directories
  const timestamp = Date.now();
  const tmpDir = join(tmpdir(), `cipherium-audio-${timestamp}`);
  const outDir = join(tmpdir(), `cipherium-output-${timestamp}`);
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const audioPath = join(tmpDir, fileName);
  writeFileSync(audioPath, audioBuffer);

  try {
    // Create transcription job with Sarvam AI
    const job = await sarvam.speechToTextJob.createJob({
      model: "saaras:v3",
      languageCode: "unknown",
      withDiarization: true,
      numSpeakers: 2,
    });

    // Upload and process
    await job.uploadFiles([audioPath]);
    await job.start();
    await job.waitUntilComplete();

    // Check for failures
    const fileResults = await job.getFileResults();
    if (fileResults.failed.length > 0) {
      throw new Error(`Transcription failed: ${fileResults.failed[0]?.error_message || "Unknown error"}`);
    }
    if (fileResults.successful.length === 0) {
      throw new Error("Transcription returned no results");
    }

    // Download outputs
    await job.downloadOutputs(outDir);

    // Read the JSON output
    const outputFiles = readdirSync(outDir).filter((f) => f.endsWith(".json"));
    if (outputFiles.length === 0) {
      throw new Error("No transcription output files found");
    }

    const out = JSON.parse(readFileSync(join(outDir, outputFiles[0]!), "utf-8"));
    console.log("Sarvam raw output keys:", Object.keys(out));

    // Extract transcript from various possible locations in the response
    const transcript: string =
      out.transcript ??
      out.text ??
      out.results?.map((r: { transcript?: string }) => r.transcript).join(" ") ??
      "";

    // Extract language
    const language: string =
      out.language_code ?? out.languageCode ?? out.language ?? "unknown";

    return {
      text: transcript,
      language: language,
    };
  } finally {
    // Clean up temp directories
    rmSync(tmpDir, { recursive: true, force: true });
    rmSync(outDir, { recursive: true, force: true });
  }
}

// Extended transcription with diarization info
export async function transcribeAudioWithDiarization(
  audioBuffer: Buffer,
  fileName: string
): Promise<DetailedTranscriptionResult> {
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  const sarvam = new SarvamAIClient({
    apiSubscriptionKey: apiKey,
  });

  // Create temp directories
  const timestamp = Date.now();
  const tmpDir = join(tmpdir(), `cipherium-audio-${timestamp}`);
  const outDir = join(tmpdir(), `cipherium-output-${timestamp}`);
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const audioPath = join(tmpDir, fileName);
  writeFileSync(audioPath, audioBuffer);

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
      throw new Error(`Transcription failed: ${fileResults.failed[0]?.error_message || "Unknown error"}`);
    }
    if (fileResults.successful.length === 0) {
      throw new Error("Transcription returned no results");
    }

    await job.downloadOutputs(outDir);

    const outputFiles = readdirSync(outDir).filter((f) => f.endsWith(".json"));
    if (outputFiles.length === 0) {
      throw new Error("No transcription output files found");
    }

    const out = JSON.parse(readFileSync(join(outDir, outputFiles[0]!), "utf-8"));

    const transcript: string =
      out.transcript ??
      out.text ??
      out.results?.map((r: { transcript?: string }) => r.transcript).join(" ") ??
      "";

    // Parse diarized entries if available
    let utterances: Utterance[] = [];
    const entries = out.diarized_transcript?.entries;
    if (Array.isArray(entries) && entries.length > 0) {
      utterances = entries.map((e: {
        speaker_id?: string;
        start_time_seconds?: number;
        end_time_seconds?: number;
        transcript?: string;
      }) => ({
        speaker: e.speaker_id ?? "0",
        start: e.start_time_seconds ?? 0,
        end: e.end_time_seconds ?? 0,
        text: e.transcript ?? "",
      }));
    }

    const speakerSet = new Set(utterances.map((u) => u.speaker));
    const speakersDetected = out.num_speakers ?? out.speakers_detected ?? speakerSet.size;
    const languageCode = out.language_code ?? out.languageCode ?? out.language ?? null;

    return {
      transcript,
      utterances,
      speakersDetected,
      languageCode,
    };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
    rmSync(outDir, { recursive: true, force: true });
  }
}
