import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CloudRain, ShieldAlert, Truck, Cpu, Clock } from 'lucide-react';

export default function TimelineLogView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // We import `api` from our services (need to ensure it's exported)
        // For now, let's just do a direct fetch or use a fallback if the API fails
        const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api') + '/timeline/events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to fetch timeline logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'RISK_UPDATE': return <Activity className="w-5 h-5 text-red-400" />;
      case 'WEATHER_SPIKE': return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'ML_PREDICTION': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'ALERT_BROADCAST': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'CORRIDOR_CLOSURE': return <Truck className="w-5 h-5 text-orange-400" />;
      case 'INCIDENT_REPORT': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-500/20 border-red-500/40 text-red-100';
      case 'HIGH': return 'bg-orange-500/20 border-orange-500/40 text-orange-100';
      case 'MODERATE': return 'bg-amber-500/20 border-amber-500/40 text-amber-100';
      case 'INFO': return 'bg-blue-500/20 border-blue-500/40 text-blue-100';
      default: return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-400">Loading V2 Logs...</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-h-[720px] overflow-y-auto">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400" />
          Version 2: Machine Learning & Event Log (24h)
        </h2>
        <span className="text-sm bg-slate-800 px-3 py-1 rounded text-slate-400">Total Events: {events.length}</span>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No events logged yet.</div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className={`flex gap-4 p-4 rounded-lg border ${getColor(ev.severity)}`}>
              <div className="mt-1">{getIcon(ev.event_type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm md:text-base">{ev.title}</h3>
                  <span className="text-xs opacity-75 whitespace-nowrap ml-4">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-90">{ev.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-black/30 px-2 py-0.5 rounded">
                    {ev.event_type}
                  </span>
                  {ev.sector && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-black/30 px-2 py-0.5 rounded text-cyan-300">
                      Sector: {ev.sector}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
