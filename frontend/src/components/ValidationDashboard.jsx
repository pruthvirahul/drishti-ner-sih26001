import React, { useState, useEffect } from 'react';
import { fetchValidationMetrics, fetchCalibratedRisk, fetchEvidence } from '../services/api';
import { CheckCircle, AlertTriangle, ShieldCheck, Activity, Link, Database, TrendingUp, BarChart } from 'lucide-react';

export default function ValidationDashboard({ selectedHotspot }) {
  const [metrics, setMetrics] = useState(null);
  const [calibration, setCalibration] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadV2Data = async () => {
      setLoading(true);
      const [metricsData, evidenceData] = await Promise.all([
        fetchValidationMetrics(),
        fetchEvidence(selectedHotspot?.name || "NH-10")
      ]);
      setMetrics(metricsData);
      setEvidence(evidenceData);

      if (selectedHotspot) {
        const calData = await fetchCalibratedRisk(
          selectedHotspot.current_risk.risk_score,
          selectedHotspot.weather.rainfall_72h,
          selectedHotspot.terrain.slope_deg
        );
        setCalibration(calData);
      }
      setLoading(false);
    };
    loadV2Data();
  }, [selectedHotspot]);

  if (loading) return <div className="text-center p-10 text-slate-400">Loading V2 Evidence & Validation Data...</div>;

  return (
    <div className="space-y-6">
      {/* V2 Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Prediction Evidence & Validation Engine (V2)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tracking historical model accuracy, calibrating raw risk scores, and surfacing external evidence.
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded text-emerald-400 text-sm font-semibold">
          Model Verified & Calibrated
        </div>
      </div>

      {/* Grid for Stats and Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ML Validation Metrics */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-cyan-400" />
            Historical Validation Metrics (48h Matching)
          </h3>
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">F1 Score</div>
                <div className="text-2xl font-bold text-cyan-400">{metrics.f1_score}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Precision</div>
                <div className="text-2xl font-bold text-emerald-400">{metrics.precision}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Recall</div>
                <div className="text-2xl font-bold text-purple-400">{metrics.recall}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Avg Lead Time</div>
                <div className="text-2xl font-bold text-amber-400">{metrics.avg_lead_time_hours}h</div>
              </div>
            </div>
          )}
          
          <div className="bg-slate-800 p-4 rounded border border-slate-700 text-sm flex gap-6">
            <div>
              <span className="text-emerald-400 font-bold block">True Positives: {metrics?.true_positives}</span>
              <span className="text-slate-400 text-xs">(Predicted & Occurred)</span>
            </div>
            <div>
              <span className="text-red-400 font-bold block">False Positives: {metrics?.false_positives}</span>
              <span className="text-slate-400 text-xs">(Predicted but False Alarm)</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block">False Negatives: {metrics?.false_negatives}</span>
              <span className="text-slate-400 text-xs">(Missed Events)</span>
            </div>
          </div>
        </div>

        {/* Current Prediction & Calibration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Calibration Layer
          </h3>
          {selectedHotspot && calibration ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-sm">Target Sector</span>
                <span className="text-slate-200 font-semibold text-sm truncate max-w-[150px]">{selectedHotspot.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-sm">Raw XGBoost Score</span>
                <span className="text-amber-400 font-bold text-lg">{calibration.raw_score} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  Calibrated Probability
                  <span className="group relative inline-block cursor-help">
                    <Database className="w-3 h-3 text-slate-500" />
                  </span>
                </span>
                <span className="text-emerald-400 font-bold text-xl">{calibration.calibrated_probability}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all" 
                  style={{width: `${calibration.calibrated_probability}%`}}
                ></div>
              </div>
              <div className="pt-3 text-xs text-slate-500 italic">
                Confidence Index: {(calibration.confidence_index * 100).toFixed(0)}% based on {calibration.historical_matches} historical matches.
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Select a hotspot to view calibration.</div>
          )}
        </div>
      </div>

      {/* Similar Events & Evidence Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Similar Historical Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg max-h-[400px] overflow-y-auto">
          <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Similar Historical Events
          </h3>
          <div className="space-y-3">
            {calibration?.similar_events?.length > 0 ? (
              calibration.similar_events.map((ev, idx) => (
                <div key={idx} className="bg-slate-800/60 p-3 rounded border border-slate-700/60">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-slate-200">{ev.location_name}</span>
                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-cyan-300">
                      Similarity: {ev.similarity_score}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-1">Date: {ev.date_occurred}</div>
                  <div className="text-xs text-slate-300 flex justify-between">
                    <span>Matched Feature: {ev.matched_features.rf_72h}mm rain</span>
                    <span className="text-emerald-400 font-bold">Observed: {ev.outcome}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No highly similar historical events found.</div>
            )}
          </div>
        </div>

        {/* Live Evidence & External Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg max-h-[400px] overflow-y-auto">
          <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-blue-400" />
            Live Evidence & Verification Links
          </h3>
          <div className="space-y-3">
            {evidence.length > 0 ? (
              evidence.map((ev, idx) => (
                <a 
                  key={idx} 
                  href={ev.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block bg-slate-800/60 p-3 rounded border border-slate-700/60 hover:bg-slate-800 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {ev.is_official ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200 leading-tight mb-1">{ev.headline}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ev.is_official ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                          {ev.source}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(ev.date_published).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-sm text-slate-500">No external evidence found for this sector.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
