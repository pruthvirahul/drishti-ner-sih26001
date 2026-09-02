"""
Common Alerting Protocol (CAP) & Emergency Broadcast API
"""
from typing import List, Dict, Any
from fastapi import APIRouter
from app.models.schemas import BroadcastAlertRequest, BroadcastAlertResponse
from app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["Emergency Alerts"])

@router.get("", response_model=List[Dict[str, Any]])
def get_alerts():
    return alert_service.get_all_alerts()

@router.post("/broadcast", response_model=BroadcastAlertResponse)
def broadcast_alert(req: BroadcastAlertRequest):
    return alert_service.broadcast_alert(req)
