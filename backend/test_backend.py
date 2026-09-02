"""
Test script to verify FastAPI endpoints and ML risk engine
"""
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.models.schemas import TerrainFeatures, WeatherMetrics
from app.models.ml_engine import ml_engine
from app.api.routes_risk import load_raw_hotspots

def test_ml():
    print("Testing ML Engine...")
    terrain = TerrainFeatures(
        slope_deg=45.0,
        elevation_m=800.0,
        aspect="South",
        lithology="Fragile Shale",
        lithology_risk_factor=0.85,
        distance_to_fault_m=400.0,
        distance_to_cut_slope_m=10.0,
        deforestation_index=0.6
    )
    weather = WeatherMetrics(
        temperature=22.0,
        humidity=92.0,
        rainfall_24h=140.0,
        rainfall_48h=210.0,
        rainfall_72h=290.0,
        soil_moisture_pct=91.0
    )
    risk = ml_engine.compute_risk(terrain, weather)
    print(f"Computed Risk Score: {risk.risk_score} / 100")
    print(f"Risk Level: {risk.risk_level} ({risk.alert_tier})")
    print(f"Trigger Probability: {risk.trigger_probability}")
    print(f"Primary Trigger: {risk.primary_trigger}")
    print("Top Factors (XAI):")
    for f in risk.top_factors:
        print(f"  - {f.factor_name}: {f.feature_value} -> Impact: {f.impact_pct}% ({f.description})")

    hotspots = load_raw_hotspots()
    print(f"\nLoaded {len(hotspots)} raw hotspots successfully.")

if __name__ == "__main__":
    test_ml()
