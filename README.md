# Neural Voice Studio

A full-stack text-to-speech web application built with React and AWS Polly. Users enter text, select from six neural voices, and generate natural-sounding audio with playback and download capabilities.

## Live Demo

**[https://kd365.github.io/neural-voice-studio/](https://kd365.github.io/neural-voice-studio/)**

The live demo is limited to 3 generations per visitor to manage AWS costs.

## Architecture

### Production (Deployed)

```
┌──────────────────────────────┐
│  GitHub Pages                │
│  React Frontend (static)     │
│  Rate Limiting (localStorage)│
└──────────┬───────────────────┘
           │ POST /api/generate
           ▼
┌──────────────────────────────┐
│  API Gateway (us-east-1)     │
│  REST API + CORS             │
└──────────┬───────────────────┘
           │ Lambda Proxy
           ▼
┌──────────────────────────────┐
│  AWS Lambda (Python 3.11)    │
│  boto3 Polly Client          │
│  Base64 Encoding             │
└──────────┬───────────────────┘
           │ synthesize_speech()
           ▼
┌──────────────────────────────┐
│  AWS Polly (us-east-1)       │
│  Neural TTS Engine           │
│  MP3 Output Stream           │
└──────────────────────────────┘
```

### Local Development

```
┌──────────────────────────────┐
│  React Frontend (:3000)      │
│  Vite Dev Server             │
└──────────┬───────────────────┘
           │ POST /api/generate
           ▼
┌──────────────────────────────┐
│  Flask Backend (:5000)       │
│  boto3 Polly Client          │
└──────────┬───────────────────┘
           │ synthesize_speech()
           ▼
┌──────────────────────────────┐
│  AWS Polly (us-east-1)       │
└──────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Lucide icons |
| **Backend (local)** | Flask 3.0, boto3 |
| **Backend (prod)** | AWS Lambda, API Gateway |
| **Cloud** | AWS Polly (neural TTS, us-east-1) |
| **Hosting** | GitHub Pages (frontend), AWS Lambda (backend) |
| **CI/CD** | GitHub Actions (build + deploy to Pages) |
| **Containers** | Docker Compose (local development) |

## Features

- **Six Neural Voices** — Joanna, Matthew, Amy, Brian, Emma, and Justin with natural intonation
- **Audio Player** — Play/pause, progress bar, elapsed/total time display
- **MP3 Download** — Save generated audio files with timestamped filenames
- **Input Validation** — Character counter (3,000 max), empty-text rejection, error messaging
- **Rate Limiting** — 3 generations per visitor via localStorage to control AWS Polly costs
- **Serverless Backend** — Lambda + API Gateway for zero idle cost
- **Multi-Stage Docker Build** — Node 22 build stage → Nginx Alpine production image (local dev)

## How It Works

1. User enters text (up to 3,000 characters) and selects a voice
2. React frontend checks localStorage rate limit (max 3 calls)
3. Frontend sends POST to API Gateway → Lambda (`/api/generate`)
4. Lambda calls `polly_client.synthesize_speech()` with the neural engine
5. AWS Polly returns an MP3 audio stream
6. Lambda base64-encodes the audio and returns it as JSON
7. Frontend decodes the blob, creates an Object URL, and streams playback

## Rate Limiting

The live demo limits each visitor to **3 text-to-speech generations** to keep AWS Polly costs minimal. The counter is stored in the browser's localStorage and resets if cleared. This is a portfolio demonstration — the architecture supports unlimited usage in a production setting.

## Project Structure

```
neural-voice-studio/
├── src/
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Global styles
│   ├── components/
│   │   └── AudioPlayer.jsx      # Audio playback UI
│   ├── services/
│   │   └── apiService.js        # API client, rate limiting, voice definitions
│   └── utils/
│       └── audioUtils.js        # Audio blob, URL, download helpers
├── lambda/
│   └── lambda_function.py       # AWS Lambda handler (production backend)
├── backend/
│   ├── app.py                   # Flask API (local development backend)
│   ├── Dockerfile               # Python 3.11-slim
│   └── requirements.txt         # Flask, Flask-CORS, boto3
├── .github/workflows/
│   └── deploy.yml               # GitHub Pages deployment workflow
├── Dockerfile                   # Frontend multi-stage (Node → Nginx)
├── docker-compose.yml           # Local development orchestration
├── vite.config.js               # Vite configuration
├── package.json                 # Frontend dependencies
└── index.html                   # HTML entry point
```

## Setup & Running

### Prerequisites

- Node.js 20+
- Python 3.11+
- AWS credentials with Polly access

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000
AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py                    # Runs on http://localhost:5000

# Frontend (separate terminal)
npm install
npm run dev                      # Runs on http://localhost:3000
```

### Docker Compose

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:5001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check — returns `{"status": "healthy"}` |
| GET | `/api/voices` | List available voices |
| POST | `/api/generate` | Generate speech — accepts `{"text": "...", "voiceId": "Joanna"}`, returns base64 MP3 |

## Author

**Kathleen Hill**
- Portfolio: [khilldata.com](https://khilldata.com)
- GitHub: [@kd365](https://github.com/kd365)
- LinkedIn: [kathleen-hill322](https://www.linkedin.com/in/kathleen-hill322/)
