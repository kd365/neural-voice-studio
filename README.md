# Neural Voice Studio

A full-stack text-to-speech web application built with React, Flask, and AWS Polly. Users enter text, select from six neural voices, and generate natural-sounding audio with playback and download capabilities.

## Architecture

```
┌─────────────────────────────┐
│   React Frontend (:3000)    │
│   Vite + Lucide Icons       │
│   Audio Blob / Object URL   │
└──────────┬──────────────────┘
           │ POST /api/generate
           ▼
┌─────────────────────────────┐
│   Flask Backend (:5001)     │
│   boto3 Polly Client        │
│   Base64 Encoding           │
└──────────┬──────────────────┘
           │ synthesize_speech()
           ▼
┌─────────────────────────────┐
│   AWS Polly (us-east-1)     │
│   Neural TTS Engine         │
│   MP3 Output Stream         │
└─────────────────────────────┘
```

Both services are orchestrated with Docker Compose, with container networking handling service discovery.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Lucide icons |
| **Backend** | Flask 3.0, boto3 |
| **Cloud** | AWS Polly (neural TTS, us-east-1) |
| **Containers** | Docker Compose (frontend + backend) |

## Features

- **Six Neural Voices** — Joanna, Matthew, Amy, Brian, Emma, and Justin with natural intonation
- **Audio Player** — Play/pause, progress bar, elapsed/total time display
- **MP3 Download** — Save generated audio files with timestamped filenames
- **Input Validation** — Character counter (3,000 max), empty-text rejection, error messaging
- **Health Endpoint** — `/health` for container orchestration and liveness probes
- **Multi-Stage Docker Build** — Node 22 build stage → Nginx Alpine production image

## How It Works

1. User enters text (up to 3,000 characters) and selects a voice
2. React frontend sends a POST to the Flask API (`/api/generate`)
3. Flask calls `polly_client.synthesize_speech()` with the neural engine
4. AWS Polly returns an MP3 audio stream
5. Backend base64-encodes the audio and returns it as JSON
6. Frontend decodes the blob, creates an Object URL, and streams playback

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
│   │   └── apiService.js        # API client, voice definitions
│   └── utils/
│       └── audioUtils.js        # Audio blob, URL, download helpers
├── backend/
│   ├── app.py                   # Flask API (health, generate, voices)
│   ├── Dockerfile               # Python 3.11-slim
│   └── requirements.txt         # Flask, Flask-CORS, boto3
├── Dockerfile                   # Frontend multi-stage (Node → Nginx)
├── docker-compose.yml           # Service orchestration
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
npm run dev                      # Runs on http://localhost:5173
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
