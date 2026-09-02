import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fallback mock data if server is booting or in offline demo mode
const FALLBACK_HOTSPOTS = [
  {
    id: "NER-MEG-001",
    name: "Sonapur Tunnel Sector (NH-6)",
    state: "Meghalaya",
    district: "East Jaintia Hills",
    coordinates: { latitude: 25.1189, longitude: 92.3683 },
    terrain: {
      slope_deg: 44.5,
      elevation_m: 820.0,
      aspect: "South-East",
      lithology: "Unconsolidated Sandstone & Fragile Shale",
      lithology_risk_factor: 0.88,
      distance_to_fault_m: 420.0,
      distance_to_cut_slope_m: 12.0,
      deforestation_index: 0.65
    },
    weather: {
      temperature: 21.5,
      humidity: 94.0,
      rainfall_24h: 145.0,
      rainfall_48h: 220.0,
      rainfall_72h: 295.0,
      soil_moisture_pct: 92.5,
      wind_speed: 18.0,
      station_id: "IMD-AWS-MEG-01"
    },
    highway_corridor: "NH-6",
    road_chainage: "KM 142.5 (Silchar Lifeline)",
    historical_events_count: 24,
    current_risk: {
      risk_score: 96.5,
      risk_level: "CRITICAL",
      alert_tier: "Severe Evacuation Alert (Red)",
      trigger_probability: 0.98,
      confidence: 0.94,
      primary_trigger: "72h Cumulative Rainfall",
      recommended_action: "Immediate highway closure, initiate red siren broadcasts and civil evacuation in valley base.",
      top_factors: [
        { factor_name: "72h Cumulative Rainfall", feature_value: "295.0 mm", impact_pct: 36.2, direction: "INCREASES_RISK", description: "Extreme monsoon rainfall exceeding critical hill drainage saturation threshold." },
        { factor_name: "Slope Inclination", feature_value: "44.5°", impact_pct: 23.8, direction: "INCREASES_RISK", description: "Steep slope exceeding critical angle of internal friction." },
        { factor_name: "Soil Moisture Saturation", feature_value: "92.5%", impact_pct: 19.4, direction: "INCREASES_RISK", description: "High pore-water pressure reducing effective shear strength." },
        { factor_name: "Lithological Vulnerability", feature_value: "Fragile Shale", impact_pct: 13.5, direction: "INCREASES_RISK", description: "Fragile rock strata prone to rapid weathering and sliding." },
        { factor_name: "Road Cut-Slope Proximity", feature_value: "12.0 m", impact_pct: 7.1, direction: "INCREASES_RISK", description: "Toe-slope excavation along highway destabilizing slope base." }
      ]
    },
    last_updated: "2026-09-02T13:30:00Z"
  },
  {
    id: "NER-SIK-001",
    name: "Melli - Teesta Valley (NH-10)",
    state: "Sikkim",
    district: "Pakyong",
    coordinates: { latitude: 27.0987, longitude: 88.4612 },
    terrain: {
      slope_deg: 48.0,
      elevation_m: 650.0,
      aspect: "West",
      lithology: "Gneissic Colluvium & Debris Bed",
      lithology_risk_factor: 0.92,
      distance_to_fault_m: 310.0,
      distance_to_cut_slope_m: 8.0,
      deforestation_index: 0.72
    },
    weather: {
      temperature: 19.0,
      humidity: 91.0,
      rainfall_24h: 128.0,
      rainfall_48h: 190.0,
      rainfall_72h: 260.0,
      soil_moisture_pct: 89.0,
      wind_speed: 15.0,
      station_id: "IMD-AWS-SIK-02"
    },
    highway_corridor: "NH-10",
    road_chainage: "KM 34.0 (Siliguri-Gangtok Corridor)",
    historical_events_count: 31,
    current_risk: {
      risk_score: 93.0,
      risk_level: "CRITICAL",
      alert_tier: "Severe Evacuation Alert (Red)",
      trigger_probability: 0.96,
      confidence: 0.94,
      primary_trigger: "72h Cumulative Rainfall",
      recommended_action: "Divert all traffic via Lava-Gorubathan link. Suspend river basin excavation.",
      top_factors: [
        { factor_name: "72h Cumulative Rainfall", feature_value: "260.0 mm", impact_pct: 34.0, direction: "INCREASES_RISK", description: "Excessive rainfall triggering debris mobilization." },
        { factor_name: "Slope Inclination", feature_value: "48.0°", impact_pct: 26.5, direction: "INCREASES_RISK", description: "Extreme gorge slope angle." },
        { factor_name: "Lithological Vulnerability", feature_value: "Gneissic Colluvium", impact_pct: 18.0, direction: "INCREASES_RISK", description: "Loose colluvial mantle prone to liquefaction." },
        { factor_name: "Soil Moisture Saturation", feature_value: "89.0%", impact_pct: 15.0, direction: "INCREASES_RISK", description: "Soil near liquid limit saturation." }
      ]
    },
    last_updated: "2026-09-02T13:30:00Z"
  },
  {
    id: "NER-NAG-001",
    name: "Dzüdza Bridge / Kohima Slope (NH-29)",
    state: "Nagaland",
    district: "Kohima",
    coordinates: { latitude: 25.6747, longitude: 94.0722 },
    terrain: {
      slope_deg: 41.0,
      elevation_m: 1440.0,
      aspect: "South-West",
      lithology: "Disraj Group Siltstone & Clayey Soil",
      lithology_risk_factor: 0.82,
      distance_to_fault_m: 580.0,
      distance_to_cut_slope_m: 14.0,
      deforestation_index: 0.58
    },
    weather: {
      temperature: 18.5,
      humidity: 88.0,
      rainfall_24h: 95.0,
      rainfall_48h: 155.0,
      rainfall_72h: 210.0,
      soil_moisture_pct: 84.0,
      wind_speed: 14.0,
      station_id: "IMD-AWS-NAG-01"
    },
    highway_corridor: "NH-29",
    road_chainage: "KM 88.2 (Dimapur-Kohima-Imphal)",
    historical_events_count: 19,
    current_risk: {
      risk_score: 77.5,
      risk_level: "HIGH",
      alert_tier: "Actionable Warning (Orange)",
      trigger_probability: 0.78,
      confidence: 0.94,
      primary_trigger: "72h Cumulative Rainfall",
      recommended_action: "Single lane transit only. Heavy freight vehicles restricted after 18:00 hrs.",
      top_factors: [
        { factor_name: "72h Cumulative Rainfall", feature_value: "210.0 mm", impact_pct: 32.0, direction: "INCREASES_RISK", description: "Rainfall exceeds 200mm threshold." },
        { factor_name: "Slope Inclination", feature_value: "41.0°", impact_pct: 24.0, direction: "INCREASES_RISK", description: "Active hill cutting along highway toe." },
        { factor_name: "Soil Moisture Saturation", feature_value: "84.0%", impact_pct: 22.0, direction: "INCREASES_RISK", description: "Clay swelling causing slope creeping." }
      ]
    },
    last_updated: "2026-09-02T13:30:00Z"
  }
];

export const fetchHotspots = async (state = null) => {
  try {
    const params = {};
    if (state && state !== "All States") {
      params.state = state;
    }
    const res = await api.get('/risk/hotspots', { params });
    return res.data;
  } catch (err) {
    console.warn("Using cached/fallback hotspots:", err.message);
    if (state && state !== "All States") {
      return FALLBACK_HOTSPOTS.filter(h => h.state.toLowerCase() === state.toLowerCase());
    }
    return FALLBACK_HOTSPOTS;
  }
};

export const fetchCorridors = async () => {
  try {
    const res = await api.get('/corridors');
    return res.data;
  } catch (err) {
    console.warn("Using fallback corridors:", err.message);
    return [];
  }
};

export const runSimulation = async (payload) => {
  try {
    const res = await api.post('/simulate', payload);
    return res.data;
  } catch (err) {
    console.warn("Simulation fallback calculation:", err.message);
    // Local calculation fallback
    const surge = payload.rainfall_surge_pct || 0;
    const simulated = FALLBACK_HOTSPOTS.map(h => {
      const cloned = JSON.parse(JSON.stringify(h));
      const newRf = (cloned.weather.rainfall_72h * (1 + surge / 100)).toFixed(1);
      cloned.weather.rainfall_72h = parseFloat(newRf);
      const newScore = Math.min(100, cloned.current_risk.risk_score + (surge * 0.25)).toFixed(1);
      cloned.current_risk.risk_score = parseFloat(newScore);
      if (cloned.current_risk.risk_score > 80) cloned.current_risk.risk_level = "CRITICAL";
      else if (cloned.current_risk.risk_score > 55) cloned.current_risk.risk_level = "HIGH";
      return cloned;
    });
    return {
      simulation_id: "SIM-LOCAL",
      scenario_description: `Simulation +${surge}% Rainfall Surge`,
      affected_hotspots_count: simulated.length,
      high_critical_count: simulated.filter(s => s.current_risk.risk_level === 'HIGH' || s.current_risk.risk_level === 'CRITICAL').length,
      impacted_corridors: ["NH-6", "NH-10", "NH-29"],
      simulated_hotspots: simulated,
      executive_summary: `Simulation complete: ${surge}% surge pushes multiple corridors into High/Critical hazard thresholds.`
    };
  }
};

export const fetchAlerts = async () => {
  try {
    const res = await api.get('/alerts');
    return res.data;
  } catch (err) {
    console.warn("Using fallback alerts:", err.message);
    return [];
  }
};

export const broadcastAlert = async (payload) => {
  const res = await api.post('/alerts/broadcast', payload);
  return res.data;
};

export const fetchIncidents = async (state = null) => {
  try {
    const params = state && state !== "All States" ? { state } : {};
    const res = await api.get('/incidents', { params });
    return res.data;
  } catch (err) {
    console.warn("Using fallback incidents:", err.message);
    return [];
  }
};

export const submitIncident = async (report) => {
  try {
    const res = await api.post('/incidents', report);
    return res.data;
  } catch (err) {
    // If offline, save to localStorage
    const offlineQueue = JSON.parse(localStorage.getItem('drishti_offline_incidents') || '[]');
    report.id = `OFFLINE-${Date.now()}`;
    report.sync_source = "OFFLINE_QUEUED";
    offlineQueue.push(report);
    localStorage.setItem('drishti_offline_incidents', JSON.stringify(offlineQueue));
    return report;
  }
};

export const syncOfflineIncidents = async () => {
  const offlineQueue = JSON.parse(localStorage.getItem('drishti_offline_incidents') || '[]');
  if (offlineQueue.length === 0) return [];
  try {
    const res = await api.post('/incidents/batch-sync', offlineQueue);
    localStorage.removeItem('drishti_offline_incidents');
    return res.data;
  } catch (err) {
    console.error("Failed to sync offline incidents:", err);
    return [];
  }
};
