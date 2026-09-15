from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.schemas_v2 import (
    ValidationMetrics, CalibratedPrediction, EvidenceRecord,
    PredictionRecord, ObservationRecord
)
from app.services.validation_engine import validation_engine, _prediction_db, _observation_db
from app.services.evidence_service import evidence_service

router = APIRouter(prefix="/v2", tags=["Version 2: Prediction Validation & Evidence"])

@router.get("/validation/metrics", response_model=ValidationMetrics)
def get_validation_metrics():
    """Retrieve confusion matrix, F1 score, precision, and historical accuracy."""
    return validation_engine.get_metrics()

@router.get("/validation/calibrate", response_model=CalibratedPrediction)
def get_calibrated_probability(raw_score: float, rf_72h: float = 200, slope: float = 40):
    """Convert raw XGBoost score to calibrated probability and find similar historical events."""
    inputs = {"rf_72h": rf_72h, "slope": slope}
    return validation_engine.calibrate_score(raw_score, inputs)

@router.get("/evidence", response_model=List[EvidenceRecord])
def get_live_evidence(location_name: str = Query(..., description="Location name to search for news/evidence")):
    """Retrieve news, IMD, and NRSC links supporting the risk assessment."""
    return evidence_service.get_evidence_for_location(location_name)

@router.get("/predictions", response_model=List[PredictionRecord])
def get_historical_predictions(limit: int = 10):
    """Get the raw historical prediction log."""
    return sorted(_prediction_db, key=lambda x: x.timestamp, reverse=True)[:limit]

@router.get("/observations", response_model=List[ObservationRecord])
def get_observed_events(limit: int = 10):
    """Get the verified ground-truth observations."""
    return sorted(_observation_db, key=lambda x: x.timestamp, reverse=True)[:limit]
