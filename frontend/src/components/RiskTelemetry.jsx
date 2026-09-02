import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CloudRain, 
  Mountain, 
  Zap, 
  Activity, 
  AlertOctagon, 
  Compass, 
  Search, 
  ExternalLink,
  Info,
  Layers
} from 'lucide-react';
import { RISK_COLOR_MAP } from '../utils/constants';

export default function RiskTelemetry({ 
  hotspots, 
  selectedHotspot, 
  onSelectHotspot, 
  onOpenXAI 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const activeSpot = selectedHotspot || hotspots[0] || null;

  const filteredHotspots = hotspots.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.highway_corridor && h.highway_corridor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeRiskLevel = activeSpot?.current_risk?.risk_level || "MODERATE";
  const activeScore = activeSpot?.current_risk?.risk_score || 50;
  const colorObj = RISK_COLOR_MAP[activeRiskLevel] || RISK_COLOR_MAP.MODERATE;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Column: Active Hotspot Deep Telemetry Card */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
        {activeSpot ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {activeSpot.highway_corridor || "Regional Sector"} • {activeSpot.road_chainage || "Hill Corridor"}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">{activeSpot.name}</h2>
                <p className="text-xs text-slate-400">{activeSpot.district} District, {activeSpot.state}</p>
              </div>

              {/* Risk Gauge Badge */}
              <div className={`text-right px-3 py-1.5 rounded-lg border ${colorObj.bg} ${colorObj.border}`}>
                <div className="text-[10px] uppercase font-bold text-slate-400">AI Risk Score</div>
                <div className={`text-2xl font-black ${colorObj.text}`}>
                  {activeScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-300 uppercase">
                  {activeSpot.current_risk?.risk_level} Hazard
                </div>
              </div>
            </div>

            {/* Core Telemetry Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Rainfall 72h */}
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>72h Rain</span>
                </div>
                <div className="text-lg font-bold text-white">{activeSpot.weather.rainfall_72h} <span className="text-xs text-slate-400 font-normal">mm</span></div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (activeSpot.weather.rainfall_72h / 300) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Threshold: 175mm</div>
              </div>

              {/* Slope Angle */}
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  <span>Slope Angle</span>
                </div>
                <div className="text-lg font-bold text-white">{activeSpot.terrain.slope_deg}°</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (activeSpot.terrain.slope_deg / 60) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Critical: &gt; 35°</div>
              </div>

              {/* Soil Saturation */}
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Soil Moisture</span>
                </div>
                <div className="text-lg font-bold text-white">{activeSpot.weather.soil_moisture_pct}%</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${activeSpot.weather.soil_moisture_pct}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Pore Pressure: High</div>
              </div>

              {/* Lithology & Elevation */}
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Elevation</span>
                </div>
                <div className="text-lg font-bold text-white">{activeSpot.terrain.elevation_m} <span className="text-xs text-slate-400 font-normal">m</span></div>
                <div className="text-[10px] text-slate-400 mt-2 truncate" title={activeSpot.terrain.lithology}>
                  Strata: {activeSpot.terrain.lithology}
                </div>
              </div>
            </div>

            {/* Action Recommendation Banner */}
            <div className={`p-3 rounded-lg border ${colorObj.bg} ${colorObj.border} flex items-start gap-3`}>
              <AlertOctagon className={`w-5 h-5 shrink-0 mt-0.5 ${colorObj.text}`} />
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200">
                  AI Mitigation Directive: {activeSpot.current_risk?.alert_tier}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSpot.current_risk?.recommended_action}
                </p>
              </div>
            </div>

            {/* Trigger Breakdown & Explainable AI (XAI) Quick Snapshot */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Top Trigger Factors (SHAP Weights)
                </span>
                <button
                  onClick={() => onOpenXAI(activeSpot)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition text-xs"
                >
                  <span>Full XAI Analysis</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                {activeSpot.current_risk?.top_factors?.slice(0, 3).map((factor, idx) => (
                  <div key={idx} className="bg-slate-800/40 p-2 rounded border border-slate-700/50 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-medium text-slate-200">{factor.factor_name}</div>
                      <div className="text-[11px] text-slate-400">{factor.description}</div>
                    </div>
                    <div className="text-right pl-3 shrink-0">
                      <div className="text-xs font-bold text-red-400">+{factor.impact_pct}%</div>
                      <div className="text-[10px] text-slate-500">{factor.feature_value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            Select a hotspot from the list or map to view real-time AI telemetry.
          </div>
        )}
      </div>

      {/* Right Column: Hotspot Selector Feed */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 flex flex-col h-[520px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Monitored NER Hotspots</h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {filteredHotspots.length} Active
          </span>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sector, state, highway (e.g. Sonapur, NH-6, Sikkim)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Scrollable Hotspot Cards */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredHotspots.map((spot) => {
            const riskLevel = spot.current_risk?.risk_level || "MODERATE";
            const score = spot.current_risk?.risk_score || 50;
            const spotColor = RISK_COLOR_MAP[riskLevel] || RISK_COLOR_MAP.MODERATE;
            const isSelected = activeSpot?.id === spot.id;

            return (
              <div
                key={spot.id}
                onClick={() => onSelectHotspot(spot)}
                className={`p-3 rounded-lg border transition cursor-pointer text-xs ${
                  isSelected 
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md' 
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-200">{spot.name}</div>
                    <div className="text-[11px] text-slate-400">{spot.district}, {spot.state}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${spotColor.badge}`}>
                    {score} / 100
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-medium">{spot.highway_corridor || "Hill Route"}</span>
                  <span>72h: {spot.weather.rainfall_72h}mm</span>
                  <span>Slope: {spot.terrain.slope_deg}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
