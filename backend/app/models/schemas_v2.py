from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PredictionRecord(BaseModel):
    id: str
    timestamp: str
    location_id: str
    location_name: str
    raw_risk_score: float
    risk_level: str
    confidence: float
    lead_time_hours: int
    top_factors: List[dict]
    inputs: dict

class ObservationRecord(BaseModel):
    id: str
    timestamp: str
    location_id: str
    location_name: str
    event_type: str
    severity: str
    source: str
    is_verified: bool
    evidence_links: List[str]

class SimilarEvent(BaseModel):
    historical_event_id: str
    location_name: str
    date_occurred: str
    similarity_score: float
    matched_features: dict
    outcome: str

class ValidationMetrics(BaseModel):
    total_predictions: int
    total_observations: int
    true_positives: int
    false_positives: int
    false_negatives: int
    true_negatives: int
    precision: float
    recall: float
    f1_score: float
    false_positive_rate: float
    avg_lead_time_hours: float

class EvidenceRecord(BaseModel):
    id: str
    headline: str
    date_published: str
    source: str
    url: str
    affected_infrastructure: List[str]
    is_official: bool

class CalibratedPrediction(BaseModel):
    raw_score: float
    calibrated_probability: float
    confidence_index: float
    historical_matches: int
    similar_events: List[SimilarEvent]
