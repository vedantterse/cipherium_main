 # Cipherium - AI-Powered Phishing Shield for Indian Languages

AI-powered phishing detection for Indian vernacular languages. Analyze text messages, audio calls, and screenshots for scam intent using advanced AI.

Built for Cybersecurity Hackathon 2026

## Features

- **Multi-Language Detection**: Supports Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, Malayalam, Gujarati, Punjabi, and English
- **Text Analysis**: Paste suspicious SMS, WhatsApp, or email messages for instant detection
- **Audio Analysis**: Upload voice call recordings for vishing (voice phishing) detection
- **Screenshot OCR**: Upload screenshots of messages - AI extracts and analyzes text automatically
- **Real-Time Risk Scoring**: Visual risk indicators (Safe / Suspicious / High Risk)
- **Manipulation Tactics Detection**: Identifies urgency, fear, authority, greed tactics
- **Suspicious Link Detection**: Finds fake bank URLs, shortened links, phishing domains
- **Chrome Extension**: Browser extension for real-time page scanning
- **Dashboard**: Visual analytics with charts and analysis history

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Styling**: Neo-Brutalism dark theme with cybersec aesthetic
- **Database**: SQLite via better-sqlite3 + Drizzle ORM
- **AI**: Groq LLaMA 4 Scout (text + vision analysis), Sarvam AI Saaras v3 (Indian language speech-to-text)
- **Auth**: JWT with httpOnly cookies
- **Deployment**: Docker + Docker Compose

## Prerequisites

- Node.js 20+ or Bun 1.1+
- Groq API Key (free tier: https://console.groq.com/keys)
- Sarvam AI API Key (https://sarvam.ai)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/cipherium.git
cd cipherium
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
SARVAM_API_KEY=your_sarvam_api_key_here
JWT_SECRET=your_random_secret_at_least_32_chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
bunx drizzle-kit push
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker Deployment

### Build and Run

```bash
# Create .env file with API keys
cp .env.example .env

# Build and start
docker compose up --build
```

### Production Deployment on VPS

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Clone repo
git clone https://github.com/yourusername/cipherium.git
cd cipherium

# Configure env
cp .env.example .env
nano .env  # Add your API keys

# Start with Docker Compose
docker compose up -d

# Check logs
docker compose logs -f
```

## Chrome Extension

The Chrome extension allows real-time phishing detection in your browser.

### Install Extension

1. Open `chrome://extensions` in Chrome
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. Click the Cipherium icon in your toolbar
6. Login via the popup to connect with dashboard

### Extension Features

- Right-click selected text → "Analyze with Cipherium"
- Scan current page content
- Upload audio files directly
- View recent analyses
- Real-time sync with dashboard

### Generate Extension Icons

The extension needs icon files. Create PNG icons at these sizes:
- `icons/icon16.png` (16x16)
- `icons/icon48.png` (48x48)
- `icons/icon128.png` (128x128)

See `chrome-extension/icons/README.md` for SVG template.

## Demo Flow

1. **Landing Page**: Visit localhost:3000 - see cybersec-themed landing
2. **Sign Up**: Create account
3. **Text Analysis**: Dashboard → Analyze → Paste Hindi scam message
4. **Audio Analysis**: Upload a voice recording
5. **Image Analysis**: Upload WhatsApp screenshot
6. **View Report**: See risk gauge, highlighted threats, AI summary
7. **Extension**: Install Chrome extension for live scanning

### Sample Scam Messages for Testing

**Hindi:**
```
Dear Customer, आपका SBI account 24 घंटे में block हो जाएगा।
तुरंत KYC update करें: http://sbi-kyc-upd8.tk
OTP share करें हमारे agent को: +91 98765 43210
```

**Marathi:**
```
तुमचे बँक खाते बंद होईल. आता KYC अपडेट करा: bit.ly/fake-kyc
OTP क्रमांक पाठवा: 9876543210
```

**Tamil:**
```
உங்கள் கணக்கு முடக்கப்படும். உடனே KYC புதுப்பிக்கவும்.
OTP எண் சொல்லுங்கள்: +91 98765 43210
```

## Project Structure

```
cipherium/
├── app/                      # Next.js app router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── layout/              # Layout components
│   ├── landing/             # Landing page sections
│   ├── dashboard/           # Dashboard components
│   ├── analyze/             # Analysis components
│   └── report/              # Report components
├── lib/                     # Core libraries
│   ├── ai/                  # AI integration
│   ├── auth/                # Authentication
│   ├── db/                  # Database
│   └── scam-patterns/       # Multi-language patterns
├── chrome-extension/        # Chrome extension
├── data/                    # SQLite database (gitignored)
├── uploads/                 # Uploaded files (gitignored)
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/analyze/text` | Analyze text message |
| POST | `/api/analyze/audio` | Analyze audio file |
| POST | `/api/analyze/image` | Analyze screenshot |
| GET | `/api/analyses` | List user's analyses |
| GET | `/api/analyses/[id]` | Get specific analysis |
| GET | `/api/stats` | Dashboard statistics |

## Scam Pattern Database

Pre-built detection patterns for:
- OTP/PIN requests
- KYC update scams
- Account blocking threats
- Lottery/prize scams
- Loan approval scams
- Job offer scams
- Investment scams
- Fake authority impersonation

Languages: Hindi, Marathi, Tamil, Telugu, Bengali + common patterns

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file

## Acknowledgments

- Groq for fast LLaMA inference
- Sarvam AI for Indian language speech-to-text
- Next.js team for the amazing framework
- All the scammers who inspired this project (sarcastically)

---

Built with security in mind for Cybersecurity Hackathon 2026
