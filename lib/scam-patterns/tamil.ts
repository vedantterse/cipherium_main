import type { ScamPattern } from "./common";

export const TAMIL_PATTERNS: ScamPattern[] = [
  {
    pattern: /OTP\s*(எண்|அனுப்ப|சொல்ல|கொடு)/i,
    category: "otp_request",
    severity: "high",
    description: "OTP request in Tamil",
    translation: "OTP number/send/tell/give",
  },
  {
    pattern: /KYC\s*(புதுப்பி|செய்|expired|காலாவதி)/i,
    category: "fake_authority",
    severity: "high",
    description: "Fake KYC demand in Tamil",
    translation: "KYC update/do/expired",
  },
  {
    pattern: /(வங்கி\s*கணக்கு|அக்கவுன்ட்).*(மூட|ப்ளாக்|முடக்க|நிறுத்த)/i,
    category: "account_threat",
    severity: "high",
    description: "Account blocking threat in Tamil",
    translation: "Bank account... close/block/freeze/stop",
  },
  {
    pattern: /(லாட்டரி|பரிசு|வெற்றி|ஜெயித்த).*(₹|ரூபாய்|லட்சம்|கோடி)/i,
    category: "prize_scam",
    severity: "high",
    description: "Prize scam in Tamil",
    translation: "Lottery/prize/victory/won... rupees/lakhs/crores",
  },
  {
    pattern: /(உடனே|உடனடி|இப்போது).*(பணம்|செலுத்து|payment|அனுப்ப)/i,
    category: "payment_demand",
    severity: "high",
    description: "Urgent payment demand in Tamil",
    translation: "Immediately/instant/now... money/pay/payment/send",
  },
  {
    pattern: /(ஆதார்|பான்|PAN)\s*(கார்டு|எண்|புதுப்பி|இணை)/i,
    category: "identity_theft",
    severity: "high",
    description: "Aadhaar/PAN request in Tamil",
    translation: "Aadhaar/PAN card/number/update/link",
  },
  {
    pattern: /(போலீஸ்|அரசு|RBI).*(நடவடிக்கை|கைது|நோட்டீஸ்)/i,
    category: "fake_authority",
    severity: "high",
    description: "Fake authority in Tamil",
    translation: "Police/government/RBI... action/arrest/notice",
  },
  {
    pattern: /(கடன்|லோன்).*(அனுமதி|approved|உடனடி)/i,
    category: "loan_scam",
    severity: "medium",
    description: "Loan scam in Tamil",
    translation: "Loan... approved/instant",
  },
];
