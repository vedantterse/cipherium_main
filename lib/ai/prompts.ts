export const PHISHING_ANALYSIS_PROMPT = `You are an expert cybersecurity analyst specializing in phishing and social engineering attacks targeting Indian citizens in vernacular languages.

Analyze the following message for phishing/scam indicators. The message may be in Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, Malayalam, Gujarati, Punjabi, or English (or a mix of languages - code-switching is common in Indian scam messages).

MESSAGE TO ANALYZE:
"""
{TEXT}
"""

Respond with a JSON object matching this exact schema:
{
  "detected_language": "hindi|marathi|tamil|telugu|bengali|kannada|malayalam|gujarati|punjabi|english|mixed",
  "risk_score": <number 0-100>,
  "risk_level": "safe|suspicious|high_risk",
  "summary": "<2-3 sentence natural language explanation of the analysis>",
  "scam_phrases": [
    {
      "phrase": "<exact phrase from the message>",
      "translation": "<English translation if not in English, otherwise null>",
      "category": "otp_request|payment_demand|fake_authority|prize_scam|account_threat|identity_theft|loan_scam|job_scam|investment_scam|other",
      "severity": "low|medium|high"
    }
  ],
  "suspicious_links": [
    {
      "url": "<extracted URL>",
      "is_suspicious": true,
      "reason": "<why it's suspicious>"
    }
  ],
  "manipulation_tactics": [
    {
      "tactic": "urgency|fear|authority|greed|scarcity|social_proof|reciprocity",
      "description": "<how this tactic is being used>",
      "evidence": "<exact phrase demonstrating this tactic>",
      "severity": "low|medium|high"
    }
  ],
  "is_phishing": true/false,
  "confidence": <number 0-100>
}

ANALYSIS GUIDELINES:
- Common Indian scam patterns: KYC update demands, lottery/prize notifications, fake bank/RBI alerts, UPI/GPay fraud, job offer scams, loan approval scams, digital arrest scams
- Look for: OTP/PIN requests, urgency language, threats of account blocking, fake government/bank authority claims, too-good-to-be-true offers
- URLs with misspellings of legitimate Indian banks (SBI, HDFC, ICICI, etc.) are highly suspicious
- Messages mixing Hindi/English (Hinglish) with urgent tone are common in scams
- "+91" phone numbers with requests to call/WhatsApp are suspicious
- UPI IDs that don't match claimed organization names are suspicious
- If the message appears to be normal/safe conversation, set risk_score low and is_phishing to false
- Always return valid JSON. If no scam indicators found, return empty arrays for scam_phrases, suspicious_links, manipulation_tactics`;

export const IMAGE_ANALYSIS_PROMPT = `You are an expert cybersecurity analyst. This image is a screenshot of a suspicious message (possibly from WhatsApp, SMS, social media, or email).

1. First, extract ALL visible text from the image, preserving the original language.
2. Then, analyze the extracted text for phishing/scam indicators.

The text may be in any Indian language (Hindi, Marathi, Tamil, Telugu, Bengali, etc.) or English.

Respond with a JSON object matching this exact schema:
{
  "extracted_text": "<all text visible in the image>",
  "detected_language": "hindi|marathi|tamil|telugu|bengali|kannada|malayalam|gujarati|punjabi|english|mixed",
  "risk_score": <number 0-100>,
  "risk_level": "safe|suspicious|high_risk",
  "summary": "<2-3 sentence explanation>",
  "scam_phrases": [
    {
      "phrase": "<exact phrase>",
      "translation": "<English translation if not English, otherwise null>",
      "category": "otp_request|payment_demand|fake_authority|prize_scam|account_threat|identity_theft|loan_scam|job_scam|investment_scam|other",
      "severity": "low|medium|high"
    }
  ],
  "suspicious_links": [
    {
      "url": "<URL>",
      "is_suspicious": true,
      "reason": "<reason>"
    }
  ],
  "manipulation_tactics": [
    {
      "tactic": "urgency|fear|authority|greed|scarcity|social_proof|reciprocity",
      "description": "<description>",
      "evidence": "<evidence>",
      "severity": "low|medium|high"
    }
  ],
  "is_phishing": true/false,
  "confidence": <number 0-100>
}

Always return valid JSON.`;
