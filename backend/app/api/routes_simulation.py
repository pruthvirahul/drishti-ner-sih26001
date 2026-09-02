"""
"What-If" Scenario Simulation Engine
Allows disaster managers to simulate cloudburst precipitation surges and tectonic tremors.
"""
import uuid
from typing import List
from fastapi import APIRouter
from app.models.schemas import SimulationRequest, SimulationResponse, Hotspot
from app.api.routes_risk import load_raw_hotspots
from app.models.ml_engine import ml_engine

router = APIRouter(prefix="/simulate", tags=["What-If Simulation Sandbox"])

@router.post("", response_model=SimulationResponse)
def run_simulation(req: SimulationRequest):
    raw_list = load_raw_hotspots()
    simulated_hotspots: List[Hotspot] = []
    high_critical_count = 0
    impacted_corridors_set = set()

    modifiers = {
        "rainfall_surge_pct": req.rainfall_surge_pct,
        "custom_rainfall_72h": req.custom_rainfall_72h,
        "soil_saturation_override": req.soil_saturation_override,
        "include_seismic_tremor": req.include_seismic_tremor,
        "seismic_magnitude": req.seismic_magnitude,
        "deforestation_multiplier": req.deforestation_multiplier
    }

    for item in raw_list:
        hotspot_obj = Hotspot(**item)
        risk = ml_engine.compute_risk(hotspot_obj.terrain, hotspot_obj.weather, modifiers)
        hotspot_obj.current_risk = risk
        
        if risk.risk_level in ["HIGH", "CRITICAL"]:
            high_critical_count += 1
            if hotspot_obj.highway_corridor:
                impacted_corridors_set.add(hotspot_obj.highway_corridor)

        simulated_hotspots.append(hotspot_obj)

    sim_id = f"SIM-{uuid.uuid4().hex[:6].upper()}"
    desc = f"Simulated Scenario: +{req.rainfall_surge_pct}% Rainfall Surge"
    if req.custom_rainfall_72h:
        desc += f", Override 72h Rain = {req.custom_rainfall_72h}mm"
    if req.include_seismic_tremor:
        desc += f", Seismic Shock M{req.seismic_magnitude}"

    summary = (
        f"Under this simulation, {high_critical_count} of {len(simulated_hotspots)} critical NER hotspots "
        f"breach safety thresholds into High/Critical hazard tiers. "
        f"Vulnerable highway corridors: {', '.join(sorted(list(impacted_corridors_set))) if impacted_corridors_set else 'None'}."
    )

    return SimulationResponse(
        simulation_id=sim_id,
        scenario_description=desc,
        affected_hotspots_count=len(simulated_hotspots),
        high_critical_count=high_critical_count,
        impacted_corridors=sorted(list(impacted_corridors_set)),
        simulated_hotspots=simulated_hotspots,
        executive_summary=summary
    )
