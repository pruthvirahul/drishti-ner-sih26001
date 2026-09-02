import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Sliders, 
  Radio, 
  PlusCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Navigation,
  Activity
} from 'lucide-react';
import { NER_STATES } from '../utils/constants';

export default function Navbar({ 
  selectedState, 
  onStateChange, 
  activeTab, 
  setActiveTab,
  onOpenSimModal, 
  onOpenReportModal, 
  onOpenBroadcastModal,
  isOnline,
  offlineCount,
  onSyncOffline
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      {/* Top Threat Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-amber-950/70 to-slate-900 border-b border-red-900/30 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-400 uppercase tracking-wider">LIVE ADVISORY:</span>
          <span className="text-slate-300 truncate">
            CRITICAL Red Warning active on NH-6 (Sonapur Tunnel) & NH-10 (Teesta 29th Mile). 72h Rainfall &gt; 280mm.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline Sync Indicator */}
          {offlineCount > 0 ? (
            <button 
              onClick={onSyncOffline}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition text-[11px]"
              title="Click to sync offline reports"
            >
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
              <span>{offlineCount} Offline Reports Pending</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">NER Grid Synced</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-medium">Offline Mode</span>
                </>
              )}
            </div>
          )}

          <div className="text-slate-500 text-[11px] hidden sm:inline">
            MDoNER / SIH26001
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 border border-cyan-400/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                DRISHTI<span className="text-cyan-400">-NER</span>
              </h1>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI Early Warning
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Landslide & Highway Lifeline Risk Engine • North Eastern Region
            </p>
          </div>
        </div>

        {/* State Filter Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium hidden md:inline">Region:</label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          >
            {NER_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Nav Tabs & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition ${
                activeTab === 'map' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>GIS Map</span>
            </button>

            <button
              onClick={() => setActiveTab('corridors')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition ${
                activeTab === 'corridors' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Highway Corridors</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition ${
                activeTab === 'analytics' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>AI Analytics</span>
            </button>
          </div>

          {/* Action Modals */}
          <button
            onClick={onOpenSimModal}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs flex items-center gap-1.5 font-medium transition shadow-sm"
            title="What-If Cloudburst Simulation"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">What-If Simulator</span>
          </button>

          <button
            onClick={onOpenBroadcastModal}
            className="px-2.5 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/60 text-red-200 border border-red-700/60 text-xs flex items-center gap-1.5 font-medium transition shadow-sm"
            title="Broadcast Emergency CAP Alert"
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">CAP Alert</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs flex items-center gap-1.5 font-semibold transition shadow-md shadow-cyan-900/30"
            title="Submit Hazard / Incident Report"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>
    </header>
  );
}
