"""
Risk Assessment & Explainable AI (XAI) API Endpoints
"""
import json
import os
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import Hotspot, RiskAssessment
from app.models.ml_engine import ml_engine
from app.services.weather_service import weather_service

router = APIRouter(prefix="/risk", tags=["Landslide Risk & AI"])

def load_raw_hotspots() -> List[dict]:
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "ner_hotspots.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/hotspots", response_model=List[Hotspot])
def get_all_hotspots(
    state: Optional[str] = Query(None, description="Filter by NER State (e.g. Meghalaya, Sikkim)"),
    risk_level: Optional[str] = Query(None, description="Filter by Risk Level (LOW, MODERATE, HIGH, CRITICAL)")
):
    raw_list = load_raw_hotspots()
    hotspots: List[Hotspot] = []

    for item in raw_list:
        if state and item["state"].lower() != state.lower():
            continue

        # Get fresh weather telemetry and compute ML risk
        hotspot_obj = Hotspot(**item)
        if hotspot_obj.weather.station_id:
            live_weather = weather_service.get_latest_weather(hotspot_obj.weather.station_id)
            hotspot_obj.weather = live_weather

        # Compute AI Risk Assessment
        risk = ml_engine.compute_risk(hotspot_obj.terrain, hotspot_obj.weather)
        hotspot_obj.current_risk = risk

        if risk_level and risk.risk_level.upper() != risk_level.upper():
            continue

        hotspots.append(hotspot_obj)

    return hotspots

@router.get("/hotspot/{hotspot_id}", response_model=Hotspot)
def get_hotspot_by_id(hotspot_id: str):
    raw_list = load_raw_hotspots()
    for item in raw_list:
        if item["id"].lower() == hotspot_id.lower():
            hotspot_obj = Hotspot(**item)
            if hotspot_obj.weather.station_id:
                hotspot_obj.weather = weather_service.get_latest_weather(hotspot_obj.weather.station_id)
            hotspot_obj.current_risk = ml_engine.compute_risk(hotspot_obj.terrain, hotspot_obj.weather)
            return hotspot_obj
    raise HTTPException(status_code=404, detail=f"Hotspot {hotspot_id} not found")

@router.get("/explain/{hotspot_id}", response_model=RiskAssessment)
def explain_hotspot_risk(hotspot_id: str):
    raw_list = load_raw_hotspots()
    for item in raw_list:
        if item["id"].lower() == hotspot_id.lower():
            hotspot_obj = Hotspot(**item)
            if hotspot_obj.weather.station_id:
                hotspot_obj.weather = weather_service.get_latest_weather(hotspot_obj.weather.station_id)
            return ml_engine.compute_risk(hotspot_obj.terrain, hotspot_obj.weather)
    raise HTTPException(status_code=404, detail=f"Hotspot {hotspot_id} not found")
