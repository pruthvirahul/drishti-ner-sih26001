"""
Field Incident Reporting & Crowdsource Verification Service
Supports Offline Sync for Low-Connectivity Eastern Regions
"""
from datetime import datetime
import uuid
from typing import Dict, List, Any
from app.models.schemas import FieldIncidentReport, GeoCoordinates

class IncidentService:
    def __init__(self):
        self.incidents: List[FieldIncidentReport] = [
            FieldIncidentReport(
                id="INC-2026-081",
                reporter_name="Capt. Rajesh Gurung",
                reporter_role="BRO_ENGINEER",
                contact_phone="+91 94350 XXXXX",
                state="Meghalaya",
                district="East Jaintia Hills",
                location_name="Sonapur Tunnel KM 141.8",
                coordinates=GeoCoordinates(latitude=25.1195, longitude=92.3690),
                hazard_type="DEBRIS_FLOW",
                severity_level="SEVERE_BLOCKAGE",
                road_passability="COMPLETELY_BLOCKED",
                photo_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
                notes="Slurry debris of 1.5m height across both lanes. 2 bulldozers mobilized.",
                timestamp="2026-09-02T11:20:00Z",
                status="VERIFIED_ALERT",
                sync_source="ONLINE"
            ),
            FieldIncidentReport(
                id="INC-2026-082",
                reporter_name="Tenzing Lepcha",
                reporter_role="FIELD_OFFICER",
                contact_phone="+91 98620 XXXXX",
                state="Sikkim",
                district="Pakyong",
                location_name="29th Mile Teesta Basin",
                coordinates=GeoCoordinates(latitude=27.1002, longitude=88.4625),
                hazard_type="ROCKFALL",
                severity_level="MODERATE",
                road_passability="RESTRICTED_SLOW",
                photo_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
                notes="Boulders falling from upper cliff face. Single-lane movement underway with caution.",
                timestamp="2026-09-02T12:05:00Z",
                status="VERIFIED_ALERT",
                sync_source="OFFLINE_SYNCED"
            ),
            FieldIncidentReport(
                id="INC-2026-083",
                reporter_name="Keviselie Angami",
                reporter_role="CITIZEN",
                contact_phone="+91 97740 XXXXX",
                state="Nagaland",
                district="Kohima",
                location_name="Dzüdza River Valley Approach",
                coordinates=GeoCoordinates(latitude=25.6760, longitude=94.0735),
                hazard_type="CRACK_DETECTION",
                severity_level="MODERATE",
                road_passability="RESTRICTED_SLOW",
                photo_url=None,
                notes="Noticed 4-inch asphalt cracks developing along road edge after 4 hours of heavy downpour.",
                timestamp="2026-09-02T13:00:00Z",
                status="VERIFIED_ALERT",
                sync_source="OFFLINE_SYNCED"
            )
        ]

    def add_incident(self, report: FieldIncidentReport) -> FieldIncidentReport:
        if not report.id:
            report.id = f"INC-2026-{uuid.uuid4().hex[:6].upper()}"
        if not report.timestamp:
            report.timestamp = datetime.utcnow().isoformat() + "Z"
        self.incidents.insert(0, report)
        return report

    def get_all_incidents(self, state: str = None) -> List[FieldIncidentReport]:
        if state:
            return [inc for inc in self.incidents if inc.state.lower() == state.lower()]
        return self.incidents

incident_service = IncidentService()
