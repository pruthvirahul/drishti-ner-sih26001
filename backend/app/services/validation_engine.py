import random
from typing import List, Dict
from datetime import datetime, timedelta, timezone
from app.models.schemas_v2 import (
    PredictionRecord, ObservationRecord, ValidationMetrics, 
    SimilarEvent, CalibratedPrediction
)

# Mock databases
_prediction_db: List[PredictionRecord] = []
_observation_db: List[ObservationRecord] = []

def _now_utc():
    return datetime.now(timezone.utc)

def _seed_historical_data():
    """Seed synthetic historical predictions and observations to demonstrate validation capabilities."""
    if _prediction_db: return

    locations = [
        {"id": "NER-MEG-001", "name": "Sonapur Tunnel Sector (NH-6)"},
        {"id": "NER-SIK-001", "name": "Melli - Teesta Valley (NH-10)"},
        {"id": "NER-NAG-001", "name": "Dzüdza Bridge (NH-29)"}
    ]

    now = _now_utc()
    
    # Generate 50 historical pairs
    for i in range(50):
        loc = random.choice(locations)
        days_ago = random.randint(1, 365)
        pred_time = now - timedelta(days=days_ago)
        
        # 30% chance of a real event happening
        event_occurred = random.random() < 0.3
        
        # If event occurred, we likely predicted it (true positive), sometimes missed (false negative)
        if event_occurred:
            predicted = random.random() < 0.85 # 85% recall
        else:
            predicted = random.random() < 0.15 # 15% false positive rate

        raw_score = random.uniform(85, 98) if predicted else random.uniform(20, 65)
        risk_level = "CRITICAL" if raw_score > 80 else ("HIGH" if raw_score > 55 else "MODERATE")

        # Log Prediction
        _prediction_db.append(PredictionRecord(
            id=f"PRED-{i:04d}",
            timestamp=pred_time.isoformat(),
            location_id=loc["id"],
            location_name=loc["name"],
            raw_risk_score=round(raw_score, 1),
            risk_level=risk_level,
            confidence=round(random.uniform(0.7, 0.98), 2),
            lead_time_hours=random.randint(12, 72) if event_occurred else 0,
            top_factors=[{"factor": "72h Rain", "value": "200mm"}] if predicted else [],
            inputs={"rf_72h": random.uniform(50, 300), "slope": random.uniform(30, 50)}
        ))

        # Log Observation if it occurred
        if event_occurred:
            obs_time = pred_time + timedelta(hours=random.randint(12, 48))
            _observation_db.append(ObservationRecord(
                id=f"OBS-{i:04d}",
                timestamp=obs_time.isoformat(),
                location_id=loc["id"],
                location_name=loc["name"],
                event_type="Landslide",
                severity="MAJOR",
                source="NHIDCL Field Report",
                is_verified=True,
                evidence_links=["https://bhuvan.nrsc.gov.in"]
            ))

_seed_historical_data()

class ValidationEngine:
    def get_metrics(self) -> ValidationMetrics:
        # Calculate confusion matrix using a 48h temporal window matching logic
        # For simplicity in this demo, we'll just evaluate based on the seeded logic
        tp = fn = fp = tn = 0
        total_lead_time = 0

        for pred in _prediction_db:
            is_predicted = pred.raw_risk_score > 80
            
            # Did an observation happen near this time for this location?
            pred_time = datetime.fromisoformat(pred.timestamp)
            matched_obs = None
            for obs in _observation_db:
                obs_time = datetime.fromisoformat(obs.timestamp)
                if obs.location_id == pred.location_id and 0 <= (obs_time - pred_time).total_seconds() <= 48*3600:
                    matched_obs = obs
                    break
            
            if is_predicted and matched_obs:
                tp += 1
                total_lead_time += pred.lead_time_hours
            elif not is_predicted and matched_obs:
                fn += 1
            elif is_predicted and not matched_obs:
                fp += 1
            else:
                tn += 1

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0

        return ValidationMetrics(
            total_predictions=len(_prediction_db),
            total_observations=len(_observation_db),
            true_positives=tp,
            false_positives=fp,
            false_negatives=fn,
            true_negatives=tn,
            precision=round(precision, 3),
            recall=round(recall, 3),
            f1_score=round(f1, 3),
            false_positive_rate=round(fpr, 3),
            avg_lead_time_hours=round(total_lead_time / tp if tp > 0 else 0, 1)
        )

    def find_similar_events(self, current_inputs: dict, limit: int = 3) -> List[SimilarEvent]:
        # Dummy Euclidean distance-based search on historical predictions that had matching observations
        events = []
        for obs in _observation_db:
            # Find the prediction that preceded it
            obs_time = datetime.fromisoformat(obs.timestamp)
            for pred in _prediction_db:
                pred_time = datetime.fromisoformat(pred.timestamp)
                if pred.location_id == obs.location_id and 0 <= (obs_time - pred_time).total_seconds() <= 48*3600:
                    
                    # Calculate dummy similarity based on rain
                    c_rain = current_inputs.get("rf_72h", 200)
                    h_rain = pred.inputs.get("rf_72h", 200)
                    sim_score = max(0, 100 - abs(c_rain - h_rain)*0.5)

                    events.append(SimilarEvent(
                        historical_event_id=obs.id,
                        location_name=obs.location_name,
                        date_occurred=obs.timestamp[:10],
                        similarity_score=round(sim_score, 1),
                        matched_features={"rf_72h": round(h_rain,1)},
                        outcome=f"{obs.severity} {obs.event_type}"
                    ))
                    break
        
        events.sort(key=lambda x: x.similarity_score, reverse=True)
        return events[:limit]

    def calibrate_score(self, raw_score: float, inputs: dict) -> CalibratedPrediction:
        # Simple Platt scaling / logistic calibration simulation
        # High raw scores historically might map to 92% actual probability
        calibrated = raw_score * 0.95 if raw_score > 80 else raw_score * 0.8
        
        sim_events = self.find_similar_events(inputs)
        confidence = 0.85 + (len(sim_events) * 0.03)

        return CalibratedPrediction(
            raw_score=round(raw_score, 1),
            calibrated_probability=round(min(99.9, max(0.1, calibrated)), 1),
            confidence_index=round(min(1.0, confidence), 2),
            historical_matches=len(sim_events),
            similar_events=sim_events
        )

validation_engine = ValidationEngine()
