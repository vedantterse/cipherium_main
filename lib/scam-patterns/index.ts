import { COMMON_PATTERNS, type ScamPattern } from "./common";
import { HINDI_PATTERNS } from "./hindi";
import { MARATHI_PATTERNS } from "./marathi";
import { TAMIL_PATTERNS } from "./tamil";
import { TELUGU_PATTERNS } from "./telugu";
import { BENGALI_PATTERNS } from "./bengali";

const ALL_PATTERNS: ScamPattern[] = [
  ...COMMON_PATTERNS,
  ...HINDI_PATTERNS,
  ...MARATHI_PATTERNS,
  ...TAMIL_PATTERNS,
  ...TELUGU_PATTERNS,
  ...BENGALI_PATTERNS,
];

export interface PatternMatch {
  phrase: string;
  category: string;
  severity: "low" | "medium" | "high";
  description: string;
  translation?: string;
}

export function runPatternMatcher(text: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const seen = new Set<string>();

  for (const pattern of ALL_PATTERNS) {
    const match = text.match(pattern.pattern);
    if (match && !seen.has(match[0])) {
      seen.add(match[0]);
      matches.push({
        phrase: match[0],
        category: pattern.category,
        severity: pattern.severity,
        description: pattern.description,
        translation: pattern.translation,
      });
    }
  }

  return matches;
}

export function calculateLocalRiskScore(matches: PatternMatch[]): number {
  if (matches.length === 0) return 0;

  let score = 0;
  for (const match of matches) {
    switch (match.severity) {
      case "high":
        score += 25;
        break;
      case "medium":
        score += 15;
        break;
      case "low":
        score += 5;
        break;
    }
  }

  return Math.min(100, score);
}
