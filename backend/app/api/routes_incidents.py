"""
Crowdsourced Field Reports & Offline Geotagging Sync API
"""
from typing import List, Optional
from fastapi import APIRouter, Query
from app.models.schemas import FieldIncidentReport
from app.services.incident_service import incident_service

router = APIRouter(prefix="/incidents", tags=["Field Incidents & Offline Sync"])

@router.get("", response_model=List[FieldIncidentReport])
def get_incidents(state: Optional[str] = Query(None, description="Filter by state")):
    return incident_service.get_all_incidents(state)

@router.post("", response_model=FieldIncidentReport)
def report_incident(report: FieldIncidentReport):
    return incident_service.add_incident(report)

@router.post("/batch-sync", response_model=List[FieldIncidentReport])
def batch_sync_offline_incidents(reports: List[FieldIncidentReport]):
    """
    Endpoint for syncing multiple incident reports captured locally by field officers while offline in remote NER areas.
    """
    synced = []
    for rep in reports:
        rep.sync_source = "OFFLINE_SYNCED"
        synced.append(incident_service.add_incident(rep))
    return synced
