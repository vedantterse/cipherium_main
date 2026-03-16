import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface GeminiAnalysisResult {
  detected_language: string;
  risk_score: number;
  risk_level: "safe" | "suspicious" | "high_risk";
  summary: string;
  scam_phrases: {
    phrase: string;
    translation: string | null;
    category: string;
    severity: "low" | "medium" | "high";
  }[];
  suspicious_links: {
    url: string;
    is_suspicious: boolean;
    reason: string;
  }[];
  manipulation_tactics: {
    tactic: string;
    description: string;
    evidence: string;
    severity: "low" | "medium" | "high";
  }[];
  is_phishing: boolean;
  confidence: number;
  extracted_text?: string;
}

const SCHEMA_INSTRUCTIONS = `Return output strictly as valid JSON matching this exact schema:

{
  "detected_language": "hindi|marathi|tamil|telugu|bengali|kannada|malayalam|gujarati|punjabi|english|mixed",
  "risk_score": number (0-100),
  "risk_level": "safe|suspicious|high_risk",
  "summary": string (2-3 sentence explanation),
  "scam_phrases": [
    {
      "phrase": string (exact phrase from the message),
      "translation": string or null (English translation if not in English),
      "category": "otp_request|payment_demand|fake_authority|prize_scam|account_threat|identity_theft|loan_scam|job_scam|investment_scam|other",
      "severity": "low|medium|high"
    }
  ],
  "suspicious_links": [
    {
      "url": string,
      "is_suspicious": boolean,
      "reason": string
    }
  ],
  "manipulation_tactics": [
    {
      "tactic": "urgency|fear|authority|greed|scarcity|social_proof|reciprocity",
      "description": string,
      "evidence": string,
      "severity": "low|medium|high"
    }
  ],
  "is_phishing": boolean,
  "confidence": number (0-100)
}

Return ONLY the raw JSON object. No markdown, no code fences, no extra text.`;

const BASE_INSTRUCTIONS = `You are an expert cybersecurity analyst specializing in phishing and social engineering attacks targeting Indian citizens in vernacular languages.

Your task:
- Analyze the provided text for phishing/scam indicators.
- Determine whether the content is likely safe, suspicious, or a phishing/scam attempt.
- Detect signals such as OTP requests, urgent payment demands, fake authority claims, account threats, impersonation, malicious links, emotional manipulation, or pressure tactics.
- Support multilingual input, including Indian regional languages (Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, Malayalam, Gujarati, Punjabi).
- Only cite evidence that appears exactly in the provided text.
- Do not invent lines, names, or events.

ANALYSIS GUIDELINES:
- Common Indian scam patterns: KYC update demands, lottery/prize notifications, fake bank/RBI alerts, UPI/GPay fraud, job offer scams, loan approval scams, digital arrest scams
- Look for: OTP/PIN requests, urgency language, threats of account blocking, fake government/bank authority claims, too-good-to-be-true offers
- URLs with misspellings of legitimate Indian banks (SBI, HDFC, ICICI, etc.) are highly suspicious
- Messages mixing Hindi/English (Hinglish) with urgent tone are common in scams
- "+91" phone numbers with requests to call/WhatsApp are suspicious
- UPI IDs that don't match claimed organization names are suspicious
- If the message appears to be normal/safe conversation, set risk_score low and is_phishing to false`;

const TEXT_SYSTEM_PROMPT = `${BASE_INSTRUCTIONS}\n\n${SCHEMA_INSTRUCTIONS}`;

const IMAGE_SYSTEM_PROMPT = `${BASE_INSTRUCTIONS}

Additional instructions for image analysis:
- You will receive a screenshot of a chat conversation or message.
- Read all visible text from the image carefully.
- Extract the conversation text and include it in the "extracted_text" field.
- Then analyze the extracted text for phishing/scam indicators.

${SCHEMA_INSTRUCTIONS}

Additionally include this field in your response:
"extracted_text": string (all text visible in the image)`;

function parseResponse(content: string): GeminiAnalysisResult {
  try {
    // Handle markdown code blocks if present
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    return JSON.parse(jsonStr.trim());
  } catch {
    // Return a safe fallback if parsing fails
    return {
      detected_language: "unknown",
      risk_score: 0,
      risk_level: "safe",
      summary: "Unable to analyze the message. Please try again.",
      scam_phrases: [],
      suspicious_links: [],
      manipulation_tactics: [],
      is_phishing: false,
      confidence: 0,
    };
  }
}

export async function analyzeTextWithGemini(
  text: string
): Promise<GeminiAnalysisResult> {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "system", content: TEXT_SYSTEM_PROMPT },
      { role: "user", content: `Analyze this message for phishing/scam indicators:\n\n${text}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  console.log("Raw AI response (text):", content);
  return parseResponse(content);
}

export async function analyzeImageWithGemini(
  imageBuffer: Buffer,
  mimeType: string
): Promise<GeminiAnalysisResult> {
  // Convert buffer to base64 data URL
  const base64Data = imageBuffer.toString("base64");
  const imageDataUrl = `data:${mimeType};base64,${base64Data}`;

  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "system", content: IMAGE_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this chat screenshot for phishing or scam indicators. Extract all visible text and analyze it." },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  console.log("Raw AI response (image):", content);
  return parseResponse(content);
}
