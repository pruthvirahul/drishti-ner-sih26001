"""
Pydantic Schemas for DRISHTI-NER
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class GeoCoordinates(BaseModel):
    latitude: float
    longitude: float

class WeatherMetrics(BaseModel):
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage")
    rainfall_24h: float = Field(..., description="24h cumulative precipitation in mm")
    rainfall_48h: float = Field(..., description="48h cumulative precipitation in mm")
    rainfall_72h: float = Field(..., description="72h antecedent rainfall in mm")
    soil_moisture_pct: float = Field(..., description="Soil volumetric water content %")
    wind_speed: float = Field(default=12.0, description="Wind speed km/h")
    station_id: Optional[str] = "IMD-AWS-NER-01"

class TerrainFeatures(BaseModel):
    slope_deg: float = Field(..., description="Slope inclination in degrees")
    elevation_m: float = Field(..., description="Elevation above sea level in meters")
    aspect: str = Field(..., description="Slope facing aspect (e.g., South-East)")
    lithology: str = Field(..., description="Geological rock formation type")
    lithology_risk_factor: float = Field(..., description="Lithological vulnerability index 0.0 - 1.0")
    distance_to_fault_m: float = Field(default=850.0, description="Distance to major tectonic fault line in meters")
    distance_to_cut_slope_m: float = Field(default=15.0, description="Distance to active road cutting in meters")
    deforestation_index: float = Field(default=0.45, description="Vegetation loss / land use index 0.0 - 1.0")

class FactorAttribution(BaseModel):
    factor_name: str
    feature_value: str
    impact_pct: float
    direction: str = "INCREASES_RISK"  # or REDUCES_RISK
    description: str

class RiskAssessment(BaseModel):
    risk_score: float = Field(..., description="Computed Risk Score (0 - 100)")
    risk_level: str = Field(..., description="LOW, MODERATE, HIGH, CRITICAL")
    alert_tier: str
    trigger_probability: float = Field(..., description="Probability of slope failure in next 24-72h (0.0 - 1.0)")
    confidence: float = Field(default=0.92, description="ML Model confidence score")
    primary_trigger: str
    recommended_action: str
    top_factors: List[FactorAttribution]

class Hotspot(BaseModel):
    id: str
    name: str
    state: str
    district: str
    coordinates: GeoCoordinates
    terrain: TerrainFeatures
    weather: WeatherMetrics
    highway_corridor: Optional[str] = None
    road_chainage: Optional[str] = None
    historical_events_count: int = 0
    current_risk: Optional[RiskAssessment] = None
    last_updated: str

class HighwaySegment(BaseModel):
    id: str
    corridor_name: str  # e.g. "NH-6 (Guwahati-Shillong-Silchar-Agartala)"
    highway_number: str  # e.g. "NH-6"
    from_city: str
    to_city: str
    start_chainage_km: float
    end_chainage_km: float
    coordinates_path: List[List[float]]  # Array of [lat, lng]
    vulnerability_score: float
    status: str  # "PASSABLE", "ONE_LANE_TRAFFIC", "HIGH_RISK_WATCH", "CRITICALLY_BLOCKED"
    blockage_probability: float
    detour_advisory: Optional[str] = None
    patrol_unit: str

class SimulationRequest(BaseModel):
    rainfall_surge_pct: float = Field(default=0.0, description="Percentage increase in 72h rainfall")
    custom_rainfall_72h: Optional[float] = None
    soil_saturation_override: Optional[float] = None
    include_seismic_tremor: bool = False
    seismic_magnitude: Optional[float] = 0.0
    deforestation_multiplier: Optional[float] = 1.0

class SimulationResponse(BaseModel):
    simulation_id: str
    scenario_description: str
    affected_hotspots_count: int
    high_critical_count: int
    impacted_corridors: List[str]
    simulated_hotspots: List[Hotspot]
    executive_summary: str

class FieldIncidentReport(BaseModel):
    id: Optional[str] = None
    reporter_name: str
    reporter_role: str  # "FIELD_OFFICER", "BRO_ENGINEER", "CITIZEN", "POLICE_PATROL"
    contact_phone: Optional[str] = None
    state: str
    district: str
    location_name: str
    coordinates: GeoCoordinates
    hazard_type: str  # "DEBRIS_FLOW", "ROCKFALL", "ROAD_SUBSIDENCE", "MUD_SLIDE", "CRACK_DETECTION"
    severity_level: str  # "MINOR", "MODERATE", "SEVERE_BLOCKAGE", "CATASTROPHIC"
    road_passability: str  # "FULLY_PASSABLE", "RESTRICTED_SLOW", "COMPLETELY_BLOCKED"
    photo_url: Optional[str] = None
    notes: Optional[str] = ""
    timestamp: Optional[str] = None
    status: str = "VERIFIED_ALERT"  # "PENDING_REVIEW", "VERIFIED_ALERT", "RESOLVED"
    sync_source: str = "ONLINE"  # "ONLINE", "OFFLINE_SYNCED"

class BroadcastAlertRequest(BaseModel):
    title: str
    urgency: str  # "ADVISORY", "WATCH", "WARNING", "EMERGENCY_EVACUATION"
    target_states: List[str]
    target_agencies: List[str]  # "SDMA", "NDRF", "BRO", "NHIDCL", "DEOC", "PUBLIC_SMS"
    corridors_affected: List[str]
    message: str
    action_required: str
    cap_identifier: Optional[str] = None

class BroadcastAlertResponse(BaseModel):
    alert_id: str
    cap_message_id: str
    dispatched_at: str
    delivery_status: Dict[str, str]
    message_payload: Dict[str, Any]
