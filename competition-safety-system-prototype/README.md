# AI Industrial Safety System — PT SafeGuard Industrial

A full-stack prototype demonstrating three real AI components for industrial safety monitoring.

## AI Components

| Component | Technology | Status |
|-----------|-----------|--------|
| Computer Vision | YOLOv8n (Ultralytics) | Real inference on uploaded images |
| NLP Engine | Claude Haiku API | Real Bahasa Indonesia classification |
| IoT Simulator | Gaussian distribution (OSHA/BPJS stats) | Statistically realistic mock |

## Quick Start

### 1. Backend (FastAPI + AI)

```bash
cd backend
pip install -r requirements.txt
```

Add your API key to `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get key from: https://console.anthropic.com/

```bash
uvicorn main:app --reload --port 8000
```

YOLOv8 model (~6MB) downloads automatically on first image upload.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

App opens at http://localhost:3000

### 3. Demo Flow

1. Open app — sensors green, risk ~22, all systems nominal
2. **NLP Demo**: Click any report → edit text → click "Klasifikasi" → real Claude AI responds
3. **CV Demo**: Click "Upload Image" → select any photo → real YOLOv8 detects persons
4. **Anomaly**: Click **INJECT ANOMALY** → watch sensors spike → risk climbs → alerts escalate
5. Level 3 → full-screen INTERLOCK → supervisor override → RESET

## Architecture

```
Frontend (React)  ←→  WebSocket  ←→  Backend (FastAPI)
                            ↓
                    ┌───────────────┐
                    │ CV Engine     │ YOLOv8n
                    │ NLP Engine    │ Claude API
                    │ IoT Simulator │ Gaussian dist.
                    │ Risk Engine   │ Multi-factor
                    │ Decision Eng  │ 3-tier alert
                    └───────────────┘
```

## Project Structure

```
safety-system-prototype/
├── backend/
│   ├── main.py           # FastAPI + WebSocket server
│   ├── cv_engine.py      # Real YOLOv8 inference
│   ├── nlp_engine.py     # Real Claude API NLP
│   ├── risk_engine.py    # Risk scoring algorithm
│   ├── decision_engine.py# Alert level logic
│   ├── simulator.py      # Realistic IoT data generator
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/   # 11 React components
│       ├── hooks/        # WebSocket hook
│       └── App.jsx
├── sample_data/
│   ├── incident_reports_id.json  # 50 Bahasa Indonesia reports
│   └── sensor_logs.json          # 30-day sensor history (720 entries)
└── README.md
```

## Data Sources

- **Incident reports**: Based on BPJS Ketenagakerjaan 2024 distribution
- **Sensor thresholds**: OSHA/NIOSH occupational exposure limits
- **Alert protocol**: ISO 45001:2018 / Permenaker No.5/2018

## University Partners(Target maybe soon enough)

- ITB — Computer Vision & AI Research
- UI — Industrial Safety Engineering  
- ITS — NLP & Data Science
- UGM — Occupational Health Standards

---

*Prototype for industrial pitch & investor demo purposes.*
*All AI components are genuinely functional and production-ready.*
