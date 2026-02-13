# Water Velocity Monitoring System

Production-ready dashboard with React (Vite + Tailwind) plus a FastAPI + TensorFlow analyzer for smart drainage flood monitoring. Node.js + Express backend (Firebase integration) is still present for auth/storage; the new Python service handles ML inference and optical flow.

## Features
- Email/password auth with roles (admin/user) backed by Firebase Authentication
- Dashboard pages: Overview, Live Feed (video upload/list/playback), Velocity Analytics (chart + table + manual entry), Alerts (threshold + history), Datasets (upload/list)
- FastAPI endpoint `/analyze-video` (uploads mp4/avi) → flood probability, average optical-flow velocity (Lucas–Kanade), risk level (LOW/MODERATE/HIGH)
- REST APIs (`/api/auth/*`, `/api/upload/*`, `/api/velocity`, `/api/alerts`) talking to Firestore/Storage
- Future hooks in code: `// TODO: Camera stream integration`, `// TODO: ML inference API`
- EmailJS dispatch on danger alerts (municipality) using `VITE_EMAILJS_*` env vars

## Stack
- Frontend: Vite + React + TypeScript + Tailwind + Chart.js
- Backend: Node.js + Express + TypeScript
- Infra: Firebase Firestore, Storage, Authentication

## Prerequisites
- Node.js 18+
- Python 3.10+ with pip (for FastAPI + TensorFlow backend)
- Firebase project with Firestore + Storage + Authentication enabled

## Setup
1) Clone/open this folder
2) Install deps
```bash
npm install --prefix frontend
npm install --prefix backend
```
3) Configure environment
- Backend: copy `backend/.env.example` to `backend/.env` and fill values:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` (keep `\n` newlines)
  - `FIREBASE_STORAGE_BUCKET` (e.g., `your-project.appspot.com`)
  - `FIREBASE_API_KEY` (from Firebase console; used for Auth REST)
  - `VELOCITY_ALERT_THRESHOLD` (optional auto-alert trigger)
- Frontend: copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL` (default `http://localhost:8000` for FastAPI). If you still run the Node backend for Firebase APIs, point to that URL instead.
- EmailJS (municipality alerts): set `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_ACCESS_TOKEN`, `VITE_MUNICIPALITY_EMAIL` (defaults provided in `.env.example`).

4) Run dev servers (two terminals)
```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```
Frontend runs at http://localhost:5173, Node backend (Firebase APIs) at http://localhost:4000, FastAPI analyzer at http://localhost:8000.

### FastAPI AI backend (Python)
This service powers the `/analyze-video` endpoint (TensorFlow flood classifier + Lucas–Kanade optical flow).

1) Place `flood_classifier.h5` in `backend/` (or set `MODEL_PATH=/path/to/model.h5`).
2) Install deps
```bash
cd backend
python -m venv .venv
.venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
# Quick alt (no venv): pip install fastapi uvicorn tensorflow opencv-python numpy
```
3) Run
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Optional: set `FRONTEND_ORIGINS=http://localhost:5173` (comma-separated) for stricter CORS.

## API (backend)
- `POST /api/auth/register` { email, password, role }
- `POST /api/auth/login` { email, password }
- `POST /api/upload/video` (multipart `file`)
- `GET /api/videos`
- `POST /api/upload/dataset` (multipart `file`)
- `GET /api/datasets`
- `POST /api/velocity` { velocity, source?, timestamp? }
- `GET /api/velocity`
- `POST /api/alerts` { threshold, velocity, status }
- `GET /api/alerts`
- `POST /analyze-video` (FastAPI) multipart `file` -> `{ flood_probability, average_velocity, risk_level }`
All protected endpoints expect `Authorization: Bearer <idToken>` (from login/register responses).
FastAPI `/analyze-video` is currently open (no auth) for local testing.

## Firebase Collections (example docs)
```json
// users/{uid}
{
  "email": "operator@example.com",
  "role": "admin",
  "createdAt": "2024-01-01T12:00:00Z"
}

// videos/{id}
{
  "id": "vid-123",
  "name": "river.mp4",
  "url": "https://storage.googleapis.com/...",
  "storagePath": "videos/vid-123-river.mp4",
  "contentType": "video/mp4",
  "size": 1234567,
  "createdAt": "2024-01-01T12:00:00Z",
  "userId": "uid-1"
}

// velocity_logs/{id}
{
  "id": "vel-1",
  "velocity": 2.35,
  "source": "sensor",
  "timestamp": "2024-01-01T12:00:00Z",
  "userId": "uid-1"
}

// alerts/{id}
{
  "id": "alert-1",
  "threshold": 2.5,
  "velocity": 3.1,
  "status": "danger",
  "triggeredAt": "2024-01-01T12:00:00Z",
  "userId": "uid-1"
}

// datasets/{id}
{
  "id": "data-1",
  "name": "dataset.csv",
  "url": "https://storage.googleapis.com/...",
  "storagePath": "datasets/data-1-dataset.csv",
  "size": 4321,
  "createdAt": "2024-01-01T12:00:00Z",
  "userId": "uid-1"
}

// models/{id}
{
  "id": "model-1",
  "name": "model.onnx",
  "version": "0.0.0",
  "status": "not-integrated",
  "uploadedAt": "2024-01-01T12:00:00Z"
}
```

## Dev notes
- Auth tokens are Firebase ID tokens; backend validates via `firebase-admin`
- File uploads use Firebase Storage signed URLs; stored metadata is written to Firestore
- Velocity alerts auto-fire when `VELOCITY_ALERT_THRESHOLD` is crossed (optional)
- Placeholders remain for camera stream + ML inference hooks

## Running scripts
- Frontend: `npm run dev --prefix frontend`, `npm run build --prefix frontend`
- Backend: `npm run dev --prefix backend`, `npm run build --prefix backend`, `npm start --prefix backend`

## Tasks
- Wire camera stream to `/live` page once hardware endpoint is ready
- Implement ML inference endpoint consuming uploaded model and feeding dashboard alerts
