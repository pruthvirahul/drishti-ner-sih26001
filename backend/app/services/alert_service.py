"""
CAP (Common Alerting Protocol) Alert Dispatcher & Multi-Agency Emergency Broadcaster
"""
from datetime import datetime
import uuid
from typing import Dict, List, Any
from app.models.schemas import BroadcastAlertRequest, BroadcastAlertResponse

class AlertService:
    def __init__(self):
        self.dispatched_alerts: List[Dict[str, Any]] = [
            {
                "alert_id": "ALT-NER-2026-001",
                "cap_message_id": "IN-NER-MDONER-CAP-2026-0902-882",
                "title": "RED WARNING: Critical Slope Failure Imminent at Sonapur Tunnel (NH-6)",
                "urgency": "EMERGENCY_EVACUATION",
                "target_states": ["Meghalaya", "Assam"],
                "target_agencies": ["SDMA", "BRO", "NDRF", "PUBLIC_SMS"],
                "corridors_affected": ["NH-6"],
                "message": "72h cumulative rainfall reached 295mm. Saturated clay shale active movement detected. Total highway transit suspended.",
                "action_required": "Halt all vehicles at Jowai / Silchar gates. Deploy BRO excavators to staging point.",
                "dispatched_at": "2026-09-02T12:45:00Z",
                "delivery_status": {
                    "SDMA_Meghalaya": "ACKNOWLEDGED_200",
                    "BRO_Project_Sewak": "DISPATCHED_ACTIVE",
                    "NDRF_1st_Bn_Guwahati": "ALERTED",
                    "Public_SMS_Gateway": "14,820_SMS_DELIVERED"
                }
            },
            {
                "alert_id": "ALT-NER-2026-002",
                "cap_message_id": "IN-NER-MDONER-CAP-2026-0902-883",
                "title": "ORANGE WATCH: High Risk of Debris Slump on NH-10 (Teesta Valley)",
                "urgency": "WARNING",
                "target_states": ["Sikkim", "West Bengal"],
                "target_agencies": ["SDMA", "BRO", "NHIDCL"],
                "corridors_affected": ["NH-10"],
                "message": "Rainfall threshold exceeded 260mm. Gneissic debris active along 29th Mile sector.",
                "action_required": "Divert light transport through Lava-Gorubathan route.",
                "dispatched_at": "2026-09-02T13:10:00Z",
                "delivery_status": {
                    "SDMA_Sikkim": "ACKNOWLEDGED_200",
                    "BRO_Project_Swastik": "DISPATCHED_ACTIVE",
                    "Public_SMS_Gateway": "8,450_SMS_DELIVERED"
                }
            }
        ]

    def broadcast_alert(self, req: BroadcastAlertRequest) -> BroadcastAlertResponse:
        alert_id = f"ALT-NER-2026-{uuid.uuid4().hex[:6].upper()}"
        cap_id = f"IN-NER-MDONER-CAP-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
        now_iso = datetime.utcnow().isoformat() + "Z"

        delivery_status = {}
        for agency in req.target_agencies:
            delivery_status[agency] = "SUCCESS_DISPATCHED_HTTP_200"
        if "PUBLIC_SMS" in req.target_agencies:
            delivery_status["Public_Cell_Broadcast"] = "32,400_CELL_BROADCAST_BEACONS_ACTIVE"

        alert_record = {
            "alert_id": alert_id,
            "cap_message_id": cap_id,
            "title": req.title,
            "urgency": req.urgency,
            "target_states": req.target_states,
            "target_agencies": req.target_agencies,
            "corridors_affected": req.corridors_affected,
            "message": req.message,
            "action_required": req.action_required,
            "dispatched_at": now_iso,
            "delivery_status": delivery_status
        }
        self.dispatched_alerts.insert(0, alert_record)

        return BroadcastAlertResponse(
            alert_id=alert_id,
            cap_message_id=cap_id,
            dispatched_at=now_iso,
            delivery_status=delivery_status,
            message_payload=alert_record
        )

    def get_all_alerts(self) -> List[Dict[str, Any]]:
        return self.dispatched_alerts

alert_service = AlertService()
