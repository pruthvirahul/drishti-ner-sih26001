"""
DRISHTI-NER Backend Server
Ministry of Development of North Eastern Region (MDoNER) - SIH26001
AI-Based Early Warning and Landslide Risk Monitoring System in NER
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from app.config import settings
from app.api.routes_risk import router as risk_router
from app.api.routes_corridors import router as corridor_router
from app.api.routes_alerts import router as alert_router
from app.api.routes_simulation import router as simulation_router
from app.api.routes_incidents import router as incident_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Based Early Warning and Landslide Risk Monitoring System for the 8 North Eastern States of India (MDoNER / SIH26001)"
)

# Enable CORS for local React dev server and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(risk_router, prefix=settings.API_PREFIX)
app.include_router(corridor_router, prefix=settings.API_PREFIX)
app.include_router(alert_router, prefix=settings.API_PREFIX)
app.include_router(simulation_router, prefix=settings.API_PREFIX)
app.include_router(incident_router, prefix=settings.API_PREFIX)

@app.get("/")
def root_status():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "ministry": "Ministry of Development of North Eastern Region (MDoNER)",
        "sih_problem_id": "SIH26001",
        "supported_states": settings.NER_STATES,
        "docs_url": "/docs"
    }

# WebSocket for real-time risk alert broadcasts to frontend dashboard
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send periodic telemetry heartbeat / stream updates
            payload = {
                "event": "HEARTBEAT_TELEMETRY",
                "status": "LIVE",
                "active_warnings_count": 2,
                "high_risk_hotspots": ["NER-MEG-001", "NER-SIK-001"],
                "timestamp": asyncio.get_event_loop().time()
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        pass
