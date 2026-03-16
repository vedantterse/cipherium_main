import type { ScamPattern } from "./common";

export const MARATHI_PATTERNS: ScamPattern[] = [
  {
    pattern: /OTP\s*(क्रमांक|पाठवा|सांगा|द्या)/i,
    category: "otp_request",
    severity: "high",
    description: "OTP request in Marathi",
    translation: "OTP number/send/tell/give",
  },
  {
    pattern: /KYC\s*(अपडेट|करा|expired|संपले)/i,
    category: "fake_authority",
    severity: "high",
    description: "Fake KYC demand in Marathi",
    translation: "KYC update/do/expired",
  },
  {
    pattern: /(बँक\s*खाते?|अकाउंट).*(बंद|ब्लॉक|गोठवा|स्थगित)/i,
    category: "account_threat",
    severity: "high",
    description: "Account blocking threat in Marathi",
    translation: "Bank account... closed/blocked/frozen",
  },
  {
    pattern: /(लॉटरी|बक्षीस|इनाम|विजेता).*(₹|रुपये|लाख|कोटी)/i,
    category: "prize_scam",
    severity: "high",
    description: "Prize scam in Marathi",
    translation: "Lottery/prize/winner... rupees/lakhs/crores",
  },
  {
    pattern: /(लगेच|तात्काळ|आता|त्वरित).*(पैसे|भरणा|payment|पाठवा)/i,
    category: "payment_demand",
    severity: "high",
    description: "Urgent payment demand in Marathi",
    translation: "Immediately/urgent/now... money/payment/send",
  },
  {
    pattern: /(आधार|पॅन|PAN)\s*(कार्ड|क्रमांक|अपडेट|लिंक)/i,
    category: "identity_theft",
    severity: "high",
    description: "Aadhaar/PAN request in Marathi",
    translation: "Aadhaar/PAN card/number/update/link",
  },
  {
    pattern: /(पोलीस|सरकार|RBI).*(कारवाई|अटक|नोटीस)/i,
    category: "fake_authority",
    severity: "high",
    description: "Fake authority in Marathi",
    translation: "Police/government/RBI... action/arrest/notice",
  },
  {
    pattern: /(कर्ज|लोन).*(मंजूर|approved|तात्काळ)/i,
    category: "loan_scam",
    severity: "medium",
    description: "Loan scam in Marathi",
    translation: "Loan... approved/instant",
  },
];
