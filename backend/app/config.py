"""
DRISHTI-NER System Configuration
MDoNER Problem ID: SIH26001
"""
from typing import Dict, List

class Settings:
    PROJECT_NAME: str = "DRISHTI-NER Landslide Early Warning & Risk System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # NER States
    NER_STATES: List[str] = [
        "Assam",
        "Arunachal Pradesh",
        "Meghalaya",
        "Manipur",
        "Mizoram",
        "Nagaland",
        "Sikkim",
        "Tripura"
    ]
    
    # Thresholds for Landslide Susceptibility & Triggering
    RISK_LEVELS: Dict[str, Dict] = {
        "LOW": {"min": 0, "max": 25, "color": "#10B981", "alert_tier": "Normal Advisory"},
        "MODERATE": {"min": 26, "max": 55, "color": "#F59E0B", "alert_tier": "Elevated Watch"},
        "HIGH": {"min": 56, "max": 80, "color": "#F97316", "alert_tier": "Actionable Warning"},
        "CRITICAL": {"min": 81, "max": 100, "color": "#EF4444", "alert_tier": "Severe Evacuation Alert"}
    }
    
    # Rainfall thresholds (mm in 72h)
    RAINFALL_TRIGGER_THRESHOLDS = {
        "advisory": 65.0,     # mm / 72h
        "watch": 115.0,        # mm / 72h
        "warning": 175.0,      # mm / 72h
        "critical": 250.0      # mm / 72h (Cloudburst / Extreme Monsoon)
    }

settings = Settings()
