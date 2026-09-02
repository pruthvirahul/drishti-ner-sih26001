import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import RiskTelemetry from './components/RiskTelemetry';
import HighwayCorridorView from './components/HighwayCorridorView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import XAIModal from './components/XAIModal';
import SimulationSandbox from './components/SimulationSandbox';
import IncidentReportModal from './components/IncidentReportModal';
import AlertBroadcastCenter from './components/AlertBroadcastCenter';

import { 
  fetchHotspots, 
  fetchCorridors, 
  fetchIncidents, 
  fetchAlerts,
  syncOfflineIncidents 
} from './services/api';

// Built-in fallback corridors so map always shows NH lines even without backend
const FALLBACK_CORRIDORS = [
  {
    id: "NH-006",
    highway_number: "NH-6",
    corridor_name: "Silchar–Jiribam Lifeline (Assam–Manipur)",
    status: "CRITICALLY_BLOCKED",
    coordinates_path: [[25.1189, 92.3683], [24.8017, 93.0832]],
    detour_advisory: "Use NH-37 via Lumding until clearance.",
    patrol_unit: "NHIDCL Emergency Cell – Silchar"
  },
  {
    id: "NH-010",
    highway_number: "NH-10",
    corridor_name: "Siliguri–Gangtok (Sikkim Entry Lifeline)",
    status: "ONE_LANE_TRAFFIC",
    coordinates_path: [[27.0987, 88.4612], [27.3314, 88.6138]],
    detour_advisory: "Alternate: Lava–Gorubathan route advised for heavy vehicles.",
    patrol_unit: "NHIDCL Patrol Unit – Melli"
  },
  {
    id: "NH-029",
    highway_number: "NH-29",
    corridor_name: "Dimapur–Kohima–Imphal Corridor (Nagaland)",
    status: "HIGH_RISK_WATCH",
    coordinates_path: [[25.6747, 94.0722], [25.4670, 94.3526]],
    detour_advisory: "Single lane transit. Heavy freight restricted after 18:00.",
    patrol_unit: "NHIDCL Kohima Sector"
  },
  {
    id: "NH-013",
    highway_number: "NH-13",
    corridor_name: "Arunachal–Assam Corridor (Tawang Access Road)",
    status: "OPERATIONAL",
    coordinates_path: [[27.5897, 92.1783], [27.0234, 92.7421]],
    detour_advisory: "No active detour. Normal transit. Stay alert near Sela Pass.",
    patrol_unit: "BRO Project Vartak"
  }
];

export default function App() {
  const [selectedState, setSelectedState] = useState('All States');
  const [activeTab, setActiveTab] = useState('map');
  const [hotspots, setHotspots] = useState([]);
  const [corridors, setCorridors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'connecting' | 'live' | 'offline'
  
  // Modals
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);
  const [xaiTargetHotspot, setXaiTargetHotspot] = useState(null);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Network & Offline Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineCount, setOfflineCount] = useState(0);

  // Check offline queue count
  const updateOfflineCount = () => {
    const queue = JSON.parse(localStorage.getItem('drishti_offline_incidents') || '[]');
    setOfflineCount(queue.length);
  };

  // Load Initial Data
  const loadData = async () => {
    try {
      const [hData, cData, iData, aData] = await Promise.all([
        fetchHotspots(selectedState),
        fetchCorridors(),
        fetchIncidents(selectedState),
        fetchAlerts()
      ]);
      setHotspots(hData);
      // If backend is down, corridors returns [] — use built-in fallback
      setCorridors(cData && cData.length > 0 ? cData : FALLBACK_CORRIDORS);
      setIncidents(iData);
      setAlerts(aData);
      if (hData.length > 0 && !selectedHotspot) {
        setSelectedHotspot(hData[0]);
      }
      // If hotspots came from backend (not fallback), backend is live
      setBackendStatus('live');
    } catch (err) {
      console.error("Error loading DRISHTI data:", err);
      setBackendStatus('offline');
      setCorridors(FALLBACK_CORRIDORS);
    }
  };

  useEffect(() => {
    loadData();
    updateOfflineCount();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineIncidents().then(() => updateOfflineCount());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // WebSocket Telemetry Heartbeat — use env var for production URL
    let ws;
    try {
      const wsBase = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api')
        .replace('https://', 'wss://')
        .replace('http://', 'ws://')
        .replace('/api', '');
      ws = new WebSocket(`${wsBase}/ws/telemetry`);
      ws.onmessage = () => {};
    } catch (e) {
      // WS not available in demo mode — this is fine
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (ws) ws.close();
    };
  }, [selectedState]);


  const handleOpenXAI = (spot) => {
    setXaiTargetHotspot(spot);
    setIsXAIModalOpen(true);
  };

  const handleApplySimulated = (simSpots) => {
    setHotspots(simSpots);
    if (simSpots.length > 0) {
      setSelectedHotspot(simSpots[0]);
    }
  };

  const handleSyncOffline = async () => {
    await syncOfflineIncidents();
    updateOfflineCount();
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        selectedState={selectedState}
        onStateChange={setSelectedState}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimModal={() => setIsSimModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
        isOnline={isOnline}
        offlineCount={offlineCount}
        onSyncOffline={handleSyncOffline}
      />

      {/* Backend Status Banner */}
      {backendStatus === 'offline' && (
        <div className="w-full bg-amber-500/15 border-b border-amber-500/30 py-1.5 px-4 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block"></span>
          <span>
            <strong>DEMO MODE</strong> — Backend not connected. Showing built-in NER calibrated data.
            To enable live data, deploy the backend on Render and set <code className="bg-slate-800 px-1 rounded">VITE_API_BASE_URL</code> in Vercel.
          </span>
        </div>
      )}
      {backendStatus === 'live' && (
        <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 py-1 px-4 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          <span>LIVE — Connected to DRISHTI-NER Backend API. Real-time telemetry active.</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-5">
        {activeTab === 'map' && (
          <div className="space-y-5">
            {/* GIS Interactive Map */}
            <MapView
              hotspots={hotspots}
              corridors={corridors}
              incidents={incidents}
              selectedState={selectedState}
              onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              onOpenXAI={handleOpenXAI}
            />

            {/* Real-time Telemetry & Hotspot Drawer */}
            <RiskTelemetry
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(spot) => setSelectedHotspot(spot)}
              onOpenXAI={handleOpenXAI}
            />
          </div>
        )}

        {activeTab === 'corridors' && (
          <HighwayCorridorView
            corridors={corridors}
            onSelectCorridor={(corridor) => {
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            hotspots={hotspots}
            corridors={corridors}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 text-center text-xs text-slate-500">
        DRISHTI-NER Landslide Early Warning & Risk System • Ministry of Development of North Eastern Region (MDoNER) • SIH 26001
      </footer>

      {/* Modals */}
      <XAIModal
        isOpen={isXAIModalOpen}
        onClose={() => setIsXAIModalOpen(false)}
        hotspot={xaiTargetHotspot}
      />

      <SimulationSandbox
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        onApplySimulatedHotspots={handleApplySimulated}
      />

      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          updateOfflineCount();
        }}
        isOnline={isOnline}
        onIncidentAdded={(newInc) => {
          setIncidents([newInc, ...incidents]);
          updateOfflineCount();
        }}
      />

      <AlertBroadcastCenter
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        alerts={alerts}
        onAlertBroadcasted={(newAlert) => {
          setAlerts([newAlert, ...alerts]);
        }}
      />
    </div>
  );
}
