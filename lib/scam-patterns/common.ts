export interface ScamPattern {
  pattern: RegExp;
  category: string;
  severity: "low" | "medium" | "high";
  description: string;
  translation?: string;
}

// Common language-agnostic patterns
export const COMMON_PATTERNS: ScamPattern[] = [
  {
    pattern: /https?:\/\/bit\.ly\/\w+/i,
    category: "suspicious_link",
    severity: "medium",
    description: "Shortened URL hiding real destination",
  },
  {
    pattern: /https?:\/\/[a-z]*(?:sbi|hdfc|icici|axis|pnb|bob|canara|kotak|paytm|phonepe|gpay)[a-z.-]*\.[a-z]{2,}/i,
    category: "suspicious_link",
    severity: "high",
    description: "Possible fake bank/payment URL",
  },
  {
    pattern: /https?:\/\/(?:t\.me|wa\.me|tinyurl\.com|goo\.gl|rb\.gy|cutt\.ly)\/\S+/i,
    category: "suspicious_link",
    severity: "medium",
    description: "Shortened/messaging URL that could redirect to phishing site",
  },
  {
    pattern: /\+91[\s-]?\d{10}/,
    category: "phone_number",
    severity: "low",
    description: "Indian phone number detected",
  },
  {
    pattern: /[a-zA-Z0-9._-]+@(ybl|paytm|oksbi|okhdfcbank|axl|ibl|apl|waaxis)/i,
    category: "upi_id",
    severity: "medium",
    description: "UPI ID detected - verify it matches the claimed sender",
  },
  {
    pattern: /\b(OTP|CVV|PIN|ATM\s*PIN|UPI\s*PIN)\b/i,
    category: "otp_request",
    severity: "high",
    description: "Request for sensitive credential (OTP/CVV/PIN)",
  },
  {
    pattern: /(?:click|tap|visit|open)\s+(?:this|the|below|here)\s*(?:link|url)/i,
    category: "suspicious_link",
    severity: "medium",
    description: "Directing user to click a link",
  },
  {
    pattern: /(?:won|win|winner|congratulations?).*(?:₹|Rs\.?|INR|rupees?|lakh|crore)/i,
    category: "prize_scam",
    severity: "high",
    description: "Prize/lottery scam with monetary amount",
  },
  {
    pattern: /(?:blocked?|suspend|deactivat|freez|clos).*(?:account|card|kyc|number)/i,
    category: "account_threat",
    severity: "high",
    description: "Threat of account/card blocking",
  },
  {
    pattern: /(?:immediately|urgent|within\s*\d+\s*(?:hour|minute|hr|min)|right\s*now|asap)/i,
    category: "urgency",
    severity: "medium",
    description: "Urgency language to pressure quick action",
  },
];
