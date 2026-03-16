# Cipherium Chrome Extension - Implementation Plan

## Overview
A Chrome extension that integrates with the Cipherium dashboard for real-time phishing detection. Uses the same authentication as the web app for seamless sync.

## Features
1. **Quick Text Analysis**: Right-click on selected text to analyze
2. **Page Scanning**: Scan entire page for suspicious content
3. **Audio Upload**: Upload voice recordings directly from extension
4. **Popup Dashboard**: Mini dashboard with recent analyses
5. **Real-Time Sync**: All analyses sync with main dashboard
6. **Same Auth**: Uses JWT from web app (shared cookies)

## Technical Architecture

### Extension Files
```
chrome-extension/
├── manifest.json         # Extension manifest v3
├── background.js         # Service worker
├── popup/
│   ├── popup.html       # Popup UI
│   ├── popup.css        # Neo-brutalism styles
│   └── popup.js         # Popup logic
├── content/
│   └── content.js       # Page content script
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Authentication Flow
1. Extension checks for auth cookie from web app domain
2. If not logged in, popup shows "Login" button → opens web app
3. After web login, cookie is available for extension API calls
4. All API calls use credentials: 'include' for cookie auth

### Context Menu
- Right-click selected text → "Analyze with Cipherium"
- Sends text to /api/analyze/text
- Shows result in popup

### Popup Features
1. Auth status (logged in/out)
2. Quick text analysis input
3. Audio file upload button
4. Scan current page button
5. Recent 3 analyses with risk badges
6. Link to full dashboard

### Real-Time Sync
- Extension analyses go to same DB as web app
- Dashboard shows all analyses instantly
- Extension badge shows high-risk count

## API Integration
Uses same endpoints as web app:
- POST /api/analyze/text
- POST /api/analyze/audio
- GET /api/analyses
- GET /api/auth/me

## Installation
1. Open chrome://extensions
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select chrome-extension folder
5. Login via popup → opens web app
6. Start analyzing!

## Build Commands
```bash
# No build needed - vanilla JS
# Just load the folder as unpacked extension
```

---

## Original Planning Notes

Yes. A Chrome extension is actually a very strong approach for this problem.

Why?

Because phishing mostly happens in:
- emails
- WhatsApp Web
- Telegram Web
- random scam websites
- fake bank pages

A browser extension can watch the page and analyze content instantly.

Judges love stuff that works live instead of uploading files.

### What your Chrome extension could do

Instead of asking users to upload text or audio, the extension can detect scams directly from the browser.

#### 1. Analyze visible text on webpages

Example:
User opens a fake site: bank-login-security-update.xyz

Page says:
"Your account will be suspended. Enter OTP immediately."

Extension scans page text.

Then popup shows:
⚠ HIGH RISK PHISHING PAGE
Reasons:
• Urgent language
• OTP request
• Suspicious domain

#### 2. Audio Upload
User can upload call recordings directly in the popup.
Audio → Speech-to-Text (Whisper) → Phishing Detection

#### 3. WhatsApp Web Protection
Content script scans messages.
If someone sends scam message, extension highlights it.

### Demo Flow
1. Open fake phishing site
2. Extension scans page
3. Popup appears: ⚠ Phishing detected
4. Show dashboard with analysis
5. Game over. Judges impressed.
