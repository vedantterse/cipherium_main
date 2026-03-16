import {
  runPatternMatcher,
  calculateLocalRiskScore,
  type PatternMatch,
} from "@/lib/scam-patterns";
import {
  analyzeTextWithGemini,
  analyzeImageWithGemini,
  type GeminiAnalysisResult,
} from "./gemini";
import { transcribeAudio } from "./stt";
import type { RiskLevel, ScamPhrase, SuspiciousLink, ManipulationTactic } from "@/lib/constants";

export interface AnalysisOutput {
  detectedLanguage: string;
  riskLevel: RiskLevel;
  riskScore: number;
  scamPhrases: ScamPhrase[];
  suspiciousLinks: SuspiciousLink[];
  manipulationTactics: ManipulationTactic[];
  aiSummary: string;
  rawAiResponse: string;
  inputText: string;
}

function determineRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "safe";
  if (score <= 65) return "suspicious";
  return "high_risk";
}

function mergeResults(
  localMatches: PatternMatch[],
  aiResult: GeminiAnalysisResult,
  inputText: string
): AnalysisOutput {
  const localScore = calculateLocalRiskScore(localMatches);

  // Composite score: take the higher of local or AI, boost if both agree
  let score = Math.max(localScore, aiResult.risk_score);
  if (localMatches.length > 0 && aiResult.is_phishing) {
    score = Math.min(100, score + 15);
  }

  // Merge scam phrases (local patterns + AI, deduplicated)
  const scamPhrases: ScamPhrase[] = [];
  const seenPhrases = new Set<string>();

  for (const match of localMatches) {
    seenPhrases.add(match.phrase.toLowerCase());
    scamPhrases.push({
      phrase: match.phrase,
      translation: match.translation,
      category: match.category,
      severity: match.severity,
    });
  }

  for (const phrase of aiResult.scam_phrases || []) {
    if (!seenPhrases.has(phrase.phrase.toLowerCase())) {
      scamPhrases.push({
        phrase: phrase.phrase,
        translation: phrase.translation || undefined,
        category: phrase.category,
        severity: phrase.severity,
      });
    }
  }

  const suspiciousLinks: SuspiciousLink[] = (aiResult.suspicious_links || []).map(
    (link) => ({
      url: link.url,
      is_suspicious: link.is_suspicious,
      reason: link.reason,
    })
  );

  const manipulationTactics: ManipulationTactic[] = (
    aiResult.manipulation_tactics || []
  ).map((tactic) => ({
    tactic: tactic.tactic,
    description: tactic.description,
    evidence: tactic.evidence,
    severity: tactic.severity,
  }));

  return {
    detectedLanguage: aiResult.detected_language || "unknown",
    riskLevel: determineRiskLevel(score),
    riskScore: Math.round(score),
    scamPhrases,
    suspiciousLinks,
    manipulationTactics,
    aiSummary: aiResult.summary || "Analysis complete.",
    rawAiResponse: JSON.stringify(aiResult),
    inputText,
  };
}

export async function analyzeText(text: string): Promise<AnalysisOutput> {
  // Run local pattern matching and AI in parallel
  const localMatches = runPatternMatcher(text);
  const aiResult = await analyzeTextWithGemini(text);

  return mergeResults(localMatches, aiResult, text);
}

export async function analyzeAudio(
  audioBuffer: Buffer,
  fileName: string
): Promise<AnalysisOutput> {
  // Step 1: Transcribe audio
  const transcription = await transcribeAudio(audioBuffer, fileName);

  // Step 2: Analyze the transcribed text
  const localMatches = runPatternMatcher(transcription.text);
  const aiResult = await analyzeTextWithGemini(transcription.text);

  // Override language if Whisper detected it
  if (transcription.language && transcription.language !== "unknown") {
    aiResult.detected_language = transcription.language;
  }

  return mergeResults(localMatches, aiResult, transcription.text);
}

export async function analyzeImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<AnalysisOutput> {
  // Send image directly to Gemini Vision for OCR + analysis
  const aiResult = await analyzeImageWithGemini(imageBuffer, mimeType);

  const extractedText = aiResult.extracted_text || "";
  const localMatches = runPatternMatcher(extractedText);

  return mergeResults(localMatches, aiResult, extractedText);
}
