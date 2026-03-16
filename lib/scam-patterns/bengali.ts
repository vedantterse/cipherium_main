import type { ScamPattern } from "./common";

export const BENGALI_PATTERNS: ScamPattern[] = [
  {
    pattern: /OTP\s*(নম্বর|পাঠান|বলুন|দিন)/i,
    category: "otp_request",
    severity: "high",
    description: "OTP request in Bengali",
    translation: "OTP number/send/tell/give",
  },
  {
    pattern: /(ব্যাংক\s*অ্যাকাউন্ট|একাউন্ট).*(বন্ধ|ব্লক|ফ্রিজ|স্থগিত)/i,
    category: "account_threat",
    severity: "high",
    description: "Account blocking threat in Bengali",
    translation: "Bank account... close/block/freeze/suspend",
  },
  {
    pattern: /(লটারি|পুরস্কার|জিতেছেন).*(₹|টাকা|লাখ|কোটি)/i,
    category: "prize_scam",
    severity: "high",
    description: "Prize scam in Bengali",
    translation: "Lottery/prize/won... rupees/lakhs/crores",
  },
  {
    pattern: /(এখনই|তাড়াতাড়ি|জরুরি|সঙ্গে\s*সঙ্গে).*(টাকা|পেমেন্ট|পাঠান|ট্রান্সফার)/i,
    category: "payment_demand",
    severity: "high",
    description: "Urgent payment demand in Bengali",
    translation: "Now/hurry/urgent/immediately... money/payment/send/transfer",
  },
  {
    pattern: /(আধার|প্যান|PAN)\s*(কার্ড|নম্বর|আপডেট|লিংক)/i,
    category: "identity_theft",
    severity: "high",
    description: "Aadhaar/PAN request in Bengali",
    translation: "Aadhaar/PAN card/number/update/link",
  },
  {
    pattern: /(পুলিশ|সরকার|RBI).*(ব্যবস্থা|গ্রেফতার|নোটিশ)/i,
    category: "fake_authority",
    severity: "high",
    description: "Fake authority in Bengali",
    translation: "Police/government/RBI... action/arrest/notice",
  },
];
