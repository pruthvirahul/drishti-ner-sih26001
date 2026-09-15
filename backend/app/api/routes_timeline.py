"""
24-Hour Activity Log & Timeline API
Tracks all risk events, alerts, incidents, and AI predictions in a rolling 24h window.
Stored in-memory (resets on server restart — upgrade to PostgreSQL for persistence).
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import random

router = APIRouter(prefix="/timeline", tags=["24h Activity Timeline"])

# In-memory event log — acts as our real-time event store
_event_log: List[dict] = []

def _now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()

def log_event(event_type: str, title: str, description: str, severity: str, sector: str = "", metadata: dict = None):
    """Called by other services to log any activity into the 24h timeline."""
    _event_log.append({
        "id": f"EVT-{len(_event_log)+1:04d}",
        "timestamp": _now_utc(),
        "event_type": event_type,   # RISK_UPDATE | ALERT_BROADCAST | INCIDENT_REPORT | ML_PREDICTION | WEATHER_SPIKE | CORRIDOR_CLOSURE
        "title": title,
        "description": description,
        "severity": severity,       # CRITICAL | HIGH | MODERATE | LOW | INFO
        "sector": sector,
        "metadata": metadata or {}
    })

def _seed_demo_events():
    """Pre-populate with realistic 24h demo events so the timeline isn't empty on first load."""
    now = datetime.now(timezone.utc)
    demo = [
        (23, "RISK_UPDATE",       "CRITICAL Risk Threshold Breached — Sonapur (NH-6)",         "XGBoost ML engine raised risk score to 96.5/100. Primary trigger: 295mm 72h rainfall.", "CRITICAL", "NER-MEG-001"),
        (22, "WEATHER_SPIKE",     "Extreme Rainfall Surge — Melli, Sikkim",                    "IMD-AWS-SIK-02 recorded 128mm in 24h. 72h antecedent: 260mm. Threshold exceeded.", "HIGH",     "NER-SIK-001"),
        (21, "ML_PREDICTION",     "ML Model Recalibrated — 8 Hotspots Updated",                "XGBoost ensemble processed fresh IMD telemetry. Confidence: 94%. All 8 NER stations updated.", "INFO", "ALL"),
        (20, "ALERT_BROADCAST",   "CAP Red Alert Issued — NH-6 Silchar Corridor",              "CAP XML broadcast sent to NDMA portal. Evacuation advisory active for valley base settlements.", "CRITICAL", "NER-MEG-001"),
        (19, "CORRIDOR_CLOSURE",  "NH-6 Declared CRITICALLY BLOCKED at KM 142.5",              "NHIDCL Emergency Cell confirmed active blockage. Detour via NH-37/Lumding activated.", "CRITICAL", "NH-006"),
        (18, "INCIDENT_REPORT",   "Field Report: Active Debris Flow — Dzüdza Bridge (NH-29)",  "Geotagged report by Field Officer Kevichüsa. Photo evidence uploaded. Coordinates: 25.67°N, 94.07°E.", "HIGH", "NER-NAG-001"),
        (17, "WEATHER_SPIKE",     "Soil Moisture Saturation Alert — Kohima Slope",             "Soil moisture reached 84% at IMD-AWS-NAG-01. Approaching liquid limit threshold.", "HIGH", "NER-NAG-001"),
        (15, "ML_PREDICTION",     "Simulation Run: +40% Rainfall Surge Scenario",              "What-If sandbox triggered. 3 sectors crossed CRITICAL threshold in simulated scenario.", "INFO", "ALL"),
        (13, "ALERT_BROADCAST",   "Orange Warning Issued — NH-29 Kohima Sector",               "Actionable warning broadcast. Single lane transit restriction enforced.", "HIGH", "NER-NAG-001"),
        (11, "INCIDENT_REPORT",   "Field Report: Road Crack Spotted — Teesta Valley",          "Field officer reported hairline cracks on NH-10 at KM 34. Structural risk being assessed.", "HIGH", "NER-SIK-001"),
        (9,  "RISK_UPDATE",       "Risk Score Dropped — Agartala Sector (Tripura)",            "Rainfall decrease brought risk score from 52 to 31. Alert level downgraded to MODERATE.", "LOW", "NER-TRI-001"),
        (7,  "WEATHER_SPIKE",     "72h Antecedent Rainfall Crossed 200mm — Imphal, Manipur",   "IMD-AWS-MAN-03 telemetry: 270mm over 72h. Soil saturation at 94%. High alert maintained.", "HIGH", "NER-MAN-001"),
        (5,  "ML_PREDICTION",     "Daily ML Retraining Cycle Completed",                       "Model retrained on 3 new field incident reports. F1 Score: 0.923. Weights updated.", "INFO", "ALL"),
        (3,  "CORRIDOR_CLOSURE",  "NH-10 Restricted to ONE LANE Traffic",                     "NHIDCL Patrol Melli issued single-lane advisory. Heavy freight banned after 18:00 IST.", "HIGH", "NH-010"),
        (1,  "ALERT_BROADCAST",   "Telecom Cell Broadcast Simulation — C-DOT CAP Gateway",    "SMS-Cell Broadcast to 12,400 subscribers in Sonapur–Silchar corridor. Delivery: Simulated.", "CRITICAL", "NER-MEG-001"),
    ]
    for hours_ago, etype, title, desc, severity, sector in demo:
        ts = (now - timedelta(hours=hours_ago)).isoformat()
        _event_log.append({
            "id": f"EVT-{len(_event_log)+1:04d}",
            "timestamp": ts,
            "event_type": etype,
            "title": title,
            "description": desc,
            "severity": severity,
            "sector": sector,
            "metadata": {}
        })

# Seed on startup
_seed_demo_events()

@router.get("/events")
def get_timeline_events(last_hours: int = 24, event_type: Optional[str] = None):
    """
    Get all activity events in the last N hours.
    Filter by event_type: RISK_UPDATE | ALERT_BROADCAST | INCIDENT_REPORT | ML_PREDICTION | WEATHER_SPIKE | CORRIDOR_CLOSURE
    """
    cutoff = datetime.now(timezone.utc) - timedelta(hours=last_hours)
    events = []
    for ev in _event_log:
        try:
            ev_time = datetime.fromisoformat(ev["timestamp"])
            if ev_time.tzinfo is None:
                ev_time = ev_time.replace(tzinfo=timezone.utc)
        except Exception:
            continue
        if ev_time >= cutoff:
            if event_type and ev["event_type"] != event_type:
                continue
            events.append(ev)
    # Sort newest first
    events.sort(key=lambda x: x["timestamp"], reverse=True)
    return {
        "total": len(events),
        "window_hours": last_hours,
        "events": events,
        "summary": {
            "critical": sum(1 for e in events if e["severity"] == "CRITICAL"),
            "high": sum(1 for e in events if e["severity"] == "HIGH"),
            "ml_predictions": sum(1 for e in events if e["event_type"] == "ML_PREDICTION"),
            "alerts_broadcast": sum(1 for e in events if e["event_type"] == "ALERT_BROADCAST"),
            "incidents": sum(1 for e in events if e["event_type"] == "INCIDENT_REPORT"),
            "corridor_closures": sum(1 for e in events if e["event_type"] == "CORRIDOR_CLOSURE"),
        }
    }

@router.get("/stats")
def get_24h_stats():
    """Summary statistics for the last 24 hours."""
    return get_timeline_events(last_hours=24)["summary"]
