import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Activity, TrendingUp, CloudRain, Mountain, ShieldAlert } from 'lucide-react';

export default function AnalyticsDashboard({ hotspots, corridors }) {
  // Aggregate data for charts
  const stateRiskData = [
    { state: 'Meghalaya', avgRisk: 91, hotspots: 4, criticalCorridors: 'NH-6' },
    { state: 'Sikkim', avgRisk: 88, hotspots: 5, criticalCorridors: 'NH-10' },
    { state: 'Manipur', avgRisk: 82, hotspots: 3, criticalCorridors: 'NH-37' },
    { state: 'Nagaland', avgRisk: 78, hotspots: 3, criticalCorridors: 'NH-29' },
    { state: 'Arunachal', avgRisk: 74, hotspots: 4, criticalCorridors: 'NH-13' },
    { state: 'Assam', avgRisk: 68, hotspots: 3, criticalCorridors: 'NH-54E' },
    { state: 'Mizoram', avgRisk: 65, hotspots: 2, criticalCorridors: 'NH-54' },
    { state: 'Tripura', avgRisk: 42, hotspots: 1, criticalCorridors: 'NH-8' }
  ];

  const rainfallCorrelationData = [
    { day: 'Day -5', rainfallMm: 45, failureProbability: 18 },
    { day: 'Day -4', rainfallMm: 78, failureProbability: 29 },
    { day: 'Day -3', rainfallMm: 125, failureProbability: 48 },
    { day: 'Day -2', rainfallMm: 195, failureProbability: 74 },
    { day: 'Day -1', rainfallMm: 260, failureProbability: 89 },
    { day: 'Today', rainfallMm: 295, failureProbability: 96 }
  ];

  const hazardDistribution = [
    { name: 'Critical Red (>80)', value: 3, color: '#EF4444' },
    { name: 'High Orange (56-80)', value: 4, color: '#F97316' },
    { name: 'Moderate Yellow (26-55)', value: 2, color: '#F59E0B' },
    { name: 'Low Green (0-25)', value: 1, color: '#10B981' }
  ];

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="text-slate-400 text-xs">Total Monitored Hotspots</div>
          <div className="text-2xl font-bold text-white mt-1">10 Sectors</div>
          <div className="text-[11px] text-cyan-400 mt-1">Across 8 NER States</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="text-slate-400 text-xs">Active High / Critical Alerts</div>
          <div className="text-2xl font-bold text-red-400 mt-1">7 Sectors</div>
          <div className="text-[11px] text-red-400 mt-1">Breaching safety limits</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="text-slate-400 text-xs">Critical Highway Corridors</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">4 Lifelines</div>
          <div className="text-[11px] text-slate-400 mt-1">NH-6, NH-10, NH-29, NH-13</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="text-slate-400 text-xs">AI Model Diagnostic Accuracy</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">94.2%</div>
          <div className="text-[11px] text-emerald-400 mt-1">XGBoost & SHAP Ensemble</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* State Risk Index Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-cyan-400" />
              <span>State-wise Average Hazard Susceptibility (0 - 100)</span>
            </h3>
            <span className="text-[10px] text-slate-400">GSI / MDoNER Weighted</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="state" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.5rem', color: '#F8FAFC' }} 
                />
                <Bar dataKey="avgRisk" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 72h Rainfall vs Failure Probability Trend */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-amber-400" />
              <span>Antecedent Rainfall (mm) vs Trigger Probability (%)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Sonapur & Teesta Corridor</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainfallCorrelationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.5rem', color: '#F8FAFC' }} 
                />
                <Line type="monotone" dataKey="rainfallMm" stroke="#06B6D4" strokeWidth={2} name="Rainfall (mm)" />
                <Line type="monotone" dataKey="failureProbability" stroke="#EF4444" strokeWidth={3} name="Failure Risk (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
