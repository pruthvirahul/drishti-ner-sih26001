import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  CloudRain, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles,
  Zap
} from 'lucide-react';
import { runSimulation } from '../services/api';

export default function SimulationSandbox({ isOpen, onClose, onApplySimulatedHotspots }) {
  const [rainfallSurge, setRainfallSurge] = useState(40);
  const [overrideRainfall, setOverrideRainfall] = useState(0);
  const [soilSaturation, setSoilSaturation] = useState(85);
  const [includeTremor, setIncludeTremor] = useState(false);
  const [tremorMagnitude, setTremorMagnitude] = useState(4.8);
  const [isLoading, setIsLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);

  if (!isOpen) return null;

  const handleRunSim = async () => {
    setIsLoading(true);
    try {
      const payload = {
        rainfall_surge_pct: parseFloat(rainfallSurge),
        custom_rainfall_72h: overrideRainfall > 0 ? parseFloat(overrideRainfall) : null,
        soil_saturation_override: parseFloat(soilSaturation),
        include_seismic_tremor: includeTremor,
        seismic_magnitude: includeTremor ? parseFloat(tremorMagnitude) : 0.0,
        deforestation_multiplier: 1.15
      };
      const res = await runSimulation(payload);
      setSimResult(res);
      if (onApplySimulatedHotspots && res.simulated_hotspots) {
        onApplySimulatedHotspots(res.simulated_hotspots);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRainfallSurge(0);
    setOverrideRainfall(0);
    setSoilSaturation(80);
    setIncludeTremor(false);
    setSimResult(null);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>"What-If" Scenario Simulation Sandbox</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold uppercase">
                  Predictive Stress Test
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Simulate cloudburst precipitation, saturated soil thresholds, and tectonic shocks across NER.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded"
          >
            ✕
          </button>
        </div>

        {/* Sliders Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Rainfall Surge Slider */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                Rainfall Surge (+%)
              </span>
              <span className="text-cyan-400 font-bold">+{rainfallSurge}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={rainfallSurge}
              onChange={(e) => setRainfallSurge(e.target.value)}
              className="w-full accent-cyan-500 bg-slate-700 rounded h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Baseline</span>
              <span>+75% Heavy</span>
              <span>+150% Monsoon Flash</span>
            </div>
          </div>

          {/* Cloudburst Rainfall Override */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                Override 72h Rain (mm)
              </span>
              <span className="text-amber-400 font-bold">
                {overrideRainfall > 0 ? `${overrideRainfall} mm` : 'Auto (Surge %)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="450"
              step="10"
              value={overrideRainfall}
              onChange={(e) => setOverrideRainfall(e.target.value)}
              className="w-full accent-amber-500 bg-slate-700 rounded h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Auto)</span>
              <span>200 mm</span>
              <span>450 mm (Extreme)</span>
            </div>
          </div>

          {/* Soil Saturation Slider */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Soil Moisture Saturation
              </span>
              <span className="text-purple-400 font-bold">{soilSaturation}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={soilSaturation}
              onChange={(e) => setSoilSaturation(e.target.value)}
              className="w-full accent-purple-500 bg-slate-700 rounded h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>30% Dry</span>
              <span>75% Wet</span>
              <span>100% Saturated</span>
            </div>
          </div>

          {/* Seismic Tremor Toggle */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Simulate Seismic Tremor
              </span>
              <input
                type="checkbox"
                checked={includeTremor}
                onChange={(e) => setIncludeTremor(e.target.checked)}
                className="rounded text-red-500 accent-red-500 w-4 h-4 cursor-pointer"
              />
            </div>
            {includeTremor && (
              <div className="pt-1 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Magnitude:</span>
                  <span className="font-bold text-red-400">M{tremorMagnitude}</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="6.5"
                  step="0.1"
                  value={tremorMagnitude}
                  onChange={(e) => setTremorMagnitude(e.target.value)}
                  className="w-full accent-red-500 bg-slate-700 rounded h-1.5 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={handleRunSim}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span>Computing ML Model...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Simulation Stress Test</span>
              </>
            )}
          </button>
        </div>

        {/* Simulation Output Card */}
        {simResult && (
          <div className="bg-slate-800/80 p-4 rounded-xl border border-purple-500/40 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Simulation Results Summary
              </span>
              <span className="font-mono text-[10px] text-slate-400">{simResult.simulation_id}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/60 p-2 rounded border border-slate-700">
                <div className="text-[10px] text-slate-400">Total Hotspots</div>
                <div className="text-lg font-bold text-white">{simResult.affected_hotspots_count}</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-red-500/30">
                <div className="text-[10px] text-red-400">Critical / High Risk</div>
                <div className="text-lg font-bold text-red-400">{simResult.high_critical_count}</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-700">
                <div className="text-[10px] text-slate-400">Compromised Corridors</div>
                <div className="text-sm font-bold text-amber-400 mt-1">
                  {simResult.impacted_corridors?.join(', ') || 'None'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-700/50">
              {simResult.executive_summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
