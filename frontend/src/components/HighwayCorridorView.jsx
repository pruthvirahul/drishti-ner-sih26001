import React from 'react';
import { 
  Navigation, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Compass, 
  CornerUpRight,
  Truck
} from 'lucide-react';

export default function HighwayCorridorView({ corridors, onSelectCorridor }) {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>NER Highway Lifeline & Road Connectivity Monitor</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold uppercase">
                Active Corridors
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live tracking of national highway blockages, landslide chainages, and Border Roads Organisation (BRO) detours.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Passable
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            One-Lane Restricted
          </span>
          <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
            Critically Blocked
          </span>
        </div>
      </div>

      {/* Corridors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {corridors.map((corridor) => {
          let statusBadgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
          let statusIcon = <CheckCircle className="w-4 h-4 text-emerald-400" />;
          let borderClass = "border-slate-800 hover:border-slate-700";

          if (corridor.status === "CRITICALLY_BLOCKED") {
            statusBadgeClass = "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse";
            statusIcon = <ShieldAlert className="w-4 h-4 text-red-400" />;
            borderClass = "border-red-900/50 bg-red-950/20";
          } else if (corridor.status === "HIGH_RISK_WATCH" || corridor.status === "ONE_LANE_TRAFFIC") {
            statusBadgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/40";
            statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
            borderClass = "border-amber-900/50 bg-amber-950/20";
          }

          return (
            <div 
              key={corridor.id}
              className={`bg-slate-900/90 border rounded-xl p-5 shadow-xl space-y-3.5 transition ${borderClass}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {corridor.highway_number}
                    </span>
                    <span className="text-xs text-slate-400">Length: {corridor.end_chainage_km} km</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{corridor.corridor_name}</h3>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${statusBadgeClass}`}>
                  {statusIcon}
                  <span>{corridor.status.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Route Endpoints */}
              <div className="flex items-center justify-between text-xs bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Origin: <strong>{corridor.from_city}</strong></span>
                </div>
                <div className="text-slate-500">➔</div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dest: <strong>{corridor.to_city}</strong></span>
                </div>
              </div>

              {/* Vulnerability & Blockage Probability */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <div className="text-slate-400 text-[11px]">Vulnerability Score</div>
                  <div className="text-base font-bold text-white">{corridor.vulnerability_score} / 100</div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full"
                      style={{ width: `${corridor.vulnerability_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <div className="text-slate-400 text-[11px]">Blockage Probability</div>
                  <div className="text-base font-bold text-amber-400">
                    {(corridor.blockage_probability * 100).toFixed(0)}%
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${corridor.blockage_probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Detour Advisory */}
              {corridor.detour_advisory && (
                <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 space-y-1 text-xs">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <CornerUpRight className="w-3.5 h-3.5" />
                    <span>BRO Recommended Alternate Detour</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {corridor.detour_advisory}
                  </p>
                </div>
              )}

              {/* Footer / Patrol Unit */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deployment: <strong>{corridor.patrol_unit}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
