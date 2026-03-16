export const RISK_LEVELS = {
  safe: { label: "Safe", color: "#00ff41", bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  suspicious: { label: "Suspicious", color: "#ffbe0b", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  high_risk: { label: "High Risk", color: "#ff006e", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
} as const;

export type RiskLevel = keyof typeof RISK_LEVELS;

export type AnalysisType = "text" | "audio" | "image";

export interface ScamPhrase {
  phrase: string;
  translation?: string;
  category: string;
  severity: "low" | "medium" | "high";
}

export interface SuspiciousLink {
  url: string;
  is_suspicious: boolean;
  reason: string;
}

export interface ManipulationTactic {
  tactic: string;
  description: string;
  evidence?: string;
  severity: "low" | "medium" | "high";
}

export interface AnalysisResult {
  id: number;
  userId: number;
  type: AnalysisType;
  inputText: string | null;
  originalFileName: string | null;
  filePath: string | null;
  imageData: string | null;
  audioTranscript: string | null;
  detectedLanguage: string | null;
  riskLevel: RiskLevel;
  riskScore: number;
  scamPhrases: ScamPhrase[];
  suspiciousLinks: SuspiciousLink[];
  manipulationTactics: ManipulationTactic[];
  aiSummary: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalScans: number;
  threatsDetected: number;
  safeCount: number;
  avgRiskScore: number;
  dailyActivity: { date: string; count: number }[];
  riskDistribution: { safe: number; suspicious: number; high_risk: number };
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: "hindi", name: "Hindi", native: "हिन्दी" },
  { code: "marathi", name: "Marathi", native: "मराठी" },
  { code: "tamil", name: "Tamil", native: "தமிழ்" },
  { code: "telugu", name: "Telugu", native: "తెలుగు" },
  { code: "bengali", name: "Bengali", native: "বাংলা" },
  { code: "kannada", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "malayalam", name: "Malayalam", native: "മലയാളം" },
  { code: "gujarati", name: "Gujarati", native: "ગુજરાતી" },
  { code: "punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "english", name: "English", native: "English" },
] as const;

export const ANALYSIS_CATEGORIES = {
  otp_request: "OTP Request",
  payment_demand: "Payment Demand",
  fake_authority: "Fake Authority",
  prize_scam: "Prize/Lottery Scam",
  account_threat: "Account Threat",
  identity_theft: "Identity Theft",
  loan_scam: "Loan Scam",
  job_scam: "Job Scam",
  investment_scam: "Investment Scam",
  suspicious_link: "Suspicious Link",
  phone_number: "Phone Number",
  upi_id: "UPI ID",
  other: "Other",
} as const;

export const MANIPULATION_TACTICS = {
  urgency: "Urgency",
  fear: "Fear",
  authority: "Authority",
  greed: "Greed",
  scarcity: "Scarcity",
  social_proof: "Social Proof",
  reciprocity: "Reciprocity",
} as const;
