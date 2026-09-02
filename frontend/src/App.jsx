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

export default function App() {
  const [selectedState, setSelectedState] = useState('All States');
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'corridors', 'analytics'
  const [hotspots, setHotspots] = useState([]);
  const [corridors, setCorridors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  
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
      setCorridors(cData);
      setIncidents(iData);
      setAlerts(aData);
      if (hData.length > 0 && !selectedHotspot) {
        setSelectedHotspot(hData[0]);
      }
    } catch (err) {
      console.error("Error loading DRISHTI data:", err);
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

    // WebSocket Telemetry Heartbeat
    let ws;
    try {
      ws = new WebSocket('ws://127.0.0.1:8000/ws/telemetry');
      ws.onmessage = (e) => {
        // Heartbeat received
      };
    } catch (e) {
      // WS fallback
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
