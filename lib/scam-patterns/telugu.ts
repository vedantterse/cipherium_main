import type { ScamPattern } from "./common";

export const TELUGU_PATTERNS: ScamPattern[] = [
  {
    pattern: /OTP\s*(నంబర్|పంపండి|చెప్పండి|ఇవ్వండి)/i,
    category: "otp_request",
    severity: "high",
    description: "OTP request in Telugu",
    translation: "OTP number/send/tell/give",
  },
  {
    pattern: /(బ్యాంక్\s*ఖాతా|అకౌంట్).*(మూస|బ్లాక్|ఫ్రీజ్|నిలిపి)/i,
    category: "account_threat",
    severity: "high",
    description: "Account blocking threat in Telugu",
    translation: "Bank account... close/block/freeze/stop",
  },
  {
    pattern: /(లాటరీ|బహుమతి|గెలుచుకున్న).*(₹|రూపాయలు|లక్షలు|కోట్లు)/i,
    category: "prize_scam",
    severity: "high",
    description: "Prize scam in Telugu",
    translation: "Lottery/prize/won... rupees/lakhs/crores",
  },
  {
    pattern: /(వెంటనే|ఇప్పుడు|తక్షణ).*(డబ్బు|చెల్లింపు|payment|పంపండి)/i,
    category: "payment_demand",
    severity: "high",
    description: "Urgent payment demand in Telugu",
    translation: "Immediately/now/instant... money/payment/send",
  },
  {
    pattern: /(ఆధార్|పాన్|PAN).*(కార్డు|నంబర్|అప్డేట్|లింక్)/i,
    category: "identity_theft",
    severity: "high",
    description: "Aadhaar/PAN request in Telugu",
    translation: "Aadhaar/PAN card/number/update/link",
  },
  {
    pattern: /(పోలీసు|ప్రభుత్వ|RBI).*(చర్య|అరెస్ట్|నోటీసు)/i,
    category: "fake_authority",
    severity: "high",
    description: "Fake authority in Telugu",
    translation: "Police/government/RBI... action/arrest/notice",
  },
];
