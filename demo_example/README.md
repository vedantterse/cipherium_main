# Cipherium

AI-powered phishing and scam detection for chat conversations, screenshots, and voice calls.

Cipherium analyzes conversations across multiple input formats and languages to detect social engineering attacks — OTP fraud, impersonation, account threats, pressure tactics, and more.

## Features

- **Text Analysis** — Paste any chat conversation for instant phishing detection with cited evidence
- **Screenshot Scan** — Upload chat screenshots; vision AI reads and analyzes the conversation
- **Voice Call Analysis** — Upload call recordings for speech-to-text with speaker diarization, then scam detection on the transcript
- **Multilingual** — Supports Indian regional languages including Hindi, Marathi, Tamil, and others
- **Structured Output** — Returns risk level, confidence score, red flags, detailed reasons with evidence, and recommended actions

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **LLM**: [Groq](https://groq.com) (Llama 4 Scout) for text and vision analysis
- **STT**: [Sarvam AI](https://www.sarvam.ai) (Saaras v3) for speech-to-text with speaker diarization
- **Validation**: [Zod](https://zod.dev) for structured output schema enforcement

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- A [Groq API key](https://console.groq.com)
- A [Sarvam AI API key](https://www.sarvam.ai) (required for audio analysis)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/cipherium.git
cd cipherium
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file with your API keys:

```
GROQ_API_KEY=your_groq_api_key
SARVAM_API_KEY=your_sarvam_api_key
```

4. Start the server:

```bash
bun run index.ts
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

| Route | Description |
|---|---|
| `GET /` | Landing page |
| `GET /dashboard` | Phishing analysis dashboard |
| `POST /analyze` | Analyze pasted chat text |
| `POST /analyze-image` | Analyze a chat screenshot |
| `POST /analyze-audio` | Transcribe and analyze a voice recording |

## API

### POST /analyze

Analyze chat text for phishing indicators.

**Request:**

```json
{ "chatText": "Hi, this is your bank..." }
```

### POST /analyze-image

Analyze a chat screenshot.

**Request:**

```json
{ "imageDataUrl": "data:image/png;base64,..." }
```

### POST /analyze-audio

Transcribe and analyze a voice call recording. Accepts `multipart/form-data` with an `audio` field.

### Response Schema (all endpoints)

```json
{
  "isScam": true,
  "riskLevel": "high_risk",
  "confidence": 90,
  "summary": "This conversation appears to be a phishing attempt...",
  "redFlags": ["OTP request", "account threat", "fake authority claim"],
  "reasons": [
    {
      "title": "OTP Request",
      "explanation": "The sender asks for a one-time password...",
      "evidence": ["Please share your OTP immediately"]
    }
  ],
  "recommendedAction": "Do not share any OTP. Contact your bank directly."
}
```

The audio endpoint additionally returns `transcript`, `utterances` (diarized speaker segments), `speakersDetected`, and `languageCode` alongside the `analysis` object.

## License

MIT
