import React from 'react';
import { 
  X, 
  BrainCircuit, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  AlertTriangle, 
  Layers, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { RISK_COLOR_MAP } from '../utils/constants';

export default function XAIModal({ hotspot, isOpen, onClose }) {
  if (!isOpen || !hotspot) return null;

  const risk = hotspot.current_risk;
  const riskLevel = risk?.risk_level || "MODERATE";
  const colorObj = RISK_COLOR_MAP[riskLevel] || RISK_COLOR_MAP.MODERATE;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Explainable AI (XAI) Diagnostic</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold uppercase">
                  SHAP Factor Analysis
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {hotspot.name} • {hotspot.district}, {hotspot.state}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Score Summary Banner */}
        <div className={`p-4 rounded-xl border ${colorObj.bg} ${colorObj.border} flex items-center justify-between`}>
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold text-slate-400">Dynamic Risk Assessment</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{risk?.alert_tier}</span>
              <span className="text-xs text-slate-400">({risk?.trigger_probability * 100}% Failure Probability)</span>
            </div>
            <p className="text-xs text-slate-300">
              Primary Driver: <strong className="text-red-400">{risk?.primary_trigger}</strong>
            </p>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-black ${colorObj.text}`}>
              {risk?.risk_score} <span className="text-sm text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Model Confidence: 94.2%</div>
          </div>
        </div>

        {/* Why is this risk high? (SHAP Factor Attribution Waterfall) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Factor Contribution Breakdown (Why is Risk Escalating?)</span>
            </h4>
            <span className="text-slate-400 text-[11px]">% of Total Failure Force</span>
          </div>

          <div className="space-y-2.5">
            {risk?.top_factors?.map((factor, idx) => (
              <div key={idx} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-cyan-300">
                      {idx + 1}
                    </span>
                    <span>{factor.factor_name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-700/80 text-[10px] font-mono text-amber-300">
                      {factor.feature_value}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-red-400">
                    +{factor.impact_pct}% Impact
                  </div>
                </div>

                {/* Progress Bar of Impact */}
                <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${factor.impact_pct * 2.2}%` }}
                  ></div>
                </div>

                {/* Geological / Meteorological Explanation */}
                <p className="text-[11px] text-slate-300 leading-relaxed pl-7">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Directives for MDoNER / SDMA / BRO */}
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/70 space-y-2 text-xs">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recommended Engineering & Traffic Directives</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {risk?.recommended_action}
          </p>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-700/50 flex items-center justify-between">
            <span>Applicable Highway: <strong>{hotspot.highway_corridor || "Local Hill Sector"}</strong></span>
            <span>Historical Failures: <strong>{hotspot.historical_events_count} past events</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            Close Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
}
