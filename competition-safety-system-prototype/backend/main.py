from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from datetime import datetime

from simulator import generate_iot_data, generate_cctv_events, get_historical_trend
from risk_engine import calculate_risk
from decision_engine import determine_alert_level
from cv_engine import analyze_frame_mock

app = FastAPI(title="AI Safety System API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

system_state = {
    "anomaly_active": False,
    "alert_level": "SAFE",
    "risk_score": 22,
    "locked": False,
    "incident_log": [],
}


@app.get("/api/state")
def get_state():
    return system_state


@app.get("/api/trend")
def get_trend():
    return get_historical_trend()


@app.post("/api/inject-anomaly")
def inject_anomaly():
    system_state["anomaly_active"] = True
    system_state["incident_log"].append({
        "time": datetime.now().strftime("%H:%M:%S"),
        "event": "Anomaly injected — multi-sensor gas spike detected",
        "level": "critical",
    })
    return {"status": "anomaly injected"}


@app.post("/api/reset")
def reset_system():
    system_state.update({
        "anomaly_active": False,
        "alert_level": "SAFE",
        "risk_score": 22,
        "locked": False,
    })
    system_state["incident_log"].append({
        "time": datetime.now().strftime("%H:%M:%S"),
        "event": "System reset by operator",
        "level": "info",
    })
    return {"status": "reset"}


@app.post("/api/supervisor-approve")
def supervisor_approve():
    system_state["alert_level"] = "LEVEL_1"
    system_state["incident_log"].append({
        "time": datetime.now().strftime("%H:%M:%S"),
        "event": "Supervisor approval granted — downgrade to Level 1",
        "level": "info",
    })
    return {"status": "approved"}


@app.post("/api/cv/analyze")
async def analyze_image(payload: dict):
    """Real YOLOv8 inference on uploaded image."""
    from cv_engine import detect_ppe
    image_b64 = payload.get("image")
    if not image_b64:
        return {"error": "No image provided"}
    return detect_ppe(image_b64)


@app.post("/api/nlp/classify")
async def classify_report(payload: dict):
    """Real Claude API incident classification."""
    from nlp_engine import classify_incident
    text = payload.get("text", "")
    if not text:
        return {"error": "No text provided"}
    return classify_incident(text)


@app.post("/api/nlp/trends")
async def analyze_trends():
    """Analyze trending hazards from sample dataset."""
    from nlp_engine import analyze_near_miss_trends
    try:
        with open("../sample_data/incident_reports_id.json") as f:
            reports = json.load(f)
        return analyze_near_miss_trends(reports[:10])
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/nlp/reports")
async def get_reports():
    """Get all sample incident reports."""
    try:
        with open("../sample_data/incident_reports_id.json") as f:
            return json.load(f)
    except Exception:
        return []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            iot = generate_iot_data(system_state["anomaly_active"])
            cctv = generate_cctv_events(system_state["anomaly_active"])
            risk = calculate_risk(iot, cctv, system_state["anomaly_active"])
            system_state["risk_score"] = risk["score"]

            alert = determine_alert_level(risk["score"], system_state["anomaly_active"])
            system_state["alert_level"] = alert

            if alert == "LEVEL_3":
                system_state["locked"] = True

            cv_data = analyze_frame_mock(system_state["anomaly_active"])

            await websocket.send_text(json.dumps({
                "iot": iot,
                "cctv": cctv,
                "risk": risk,
                "alert": alert,
                "locked": system_state["locked"],
                "incident_log": system_state["incident_log"][-5:],
                "cv": cv_data,
                "timestamp": datetime.now().isoformat(),
            }))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
