import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Polyline, 
  Popup, 
  useMap 
} from 'react-leaflet';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CloudRain, 
  Mountain, 
  Zap, 
  Layers, 
  Eye, 
  Activity,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { MAP_CENTERS, RISK_COLOR_MAP, TILE_PROVIDERS } from '../utils/constants';

// Component to dynamically re-center Leaflet map when state selection changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  hotspots, 
  corridors, 
  incidents, 
  selectedState, 
  onSelectHotspot, 
  onOpenXAI 
}) {
  const [activeTileKey, setActiveTileKey] = useState('dark');
  const [showCorridors, setShowCorridors] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHeatCircles, setShowHeatCircles] = useState(true);

  const currentCenter = MAP_CENTERS[selectedState] || MAP_CENTERS["All States"];

  return (
    <div className="relative w-full h-[650px] lg:h-[720px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Map Layer Controls */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2 shadow-xl flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-300 font-semibold pr-2 border-r border-slate-700">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>GIS Layers</span>
        </div>

        {/* Tile Selector */}
        <select
          value={activeTileKey}
          onChange={(e) => setActiveTileKey(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none"
        >
          <option value="dark">Dark Carto</option>
          <option value="topo">OpenTopo Terrain</option>
          <option value="osm">Standard OSM</option>
        </select>

        {/* Layer Toggles */}
        <button
          onClick={() => setShowCorridors(!showCorridors)}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
            showCorridors ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          Corridors (NH-6/10/29)
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
            showIncidents ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          Field Reports ({incidents.length})
        </button>

        <button
          onClick={() => setShowHeatCircles(!showHeatCircles)}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
            showHeatCircles ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          Risk Radar Zones
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 shadow-xl text-xs space-y-1.5 hidden sm:block">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hazard Vulnerability Scale</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">0 - 25 Low Advisory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">26 - 55 Watch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-300">56 - 80 High Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-slate-300">81 - 100 Severe Red</span>
          </div>
        </div>
      </div>

      {/* Actual Leaflet Map */}
      <MapContainer
        center={[currentCenter.lat, currentCenter.lng]}
        zoom={currentCenter.zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={currentCenter} zoom={currentCenter.zoom} />

        <TileLayer
          url={TILE_PROVIDERS[activeTileKey].url}
          attribution={TILE_PROVIDERS[activeTileKey].attribution}
        />

        {/* Highway Corridors Polylines */}
        {showCorridors && corridors.map((corridor) => {
          let color = "#10B981"; // green
          if (corridor.status === "CRITICALLY_BLOCKED") color = "#EF4444";
          else if (corridor.status === "HIGH_RISK_WATCH") color = "#F97316";
          else if (corridor.status === "ONE_LANE_TRAFFIC") color = "#F59E0B";

          return (
            <Polyline
              key={corridor.id}
              positions={corridor.coordinates_path}
              pathOptions={{
                color: color,
                weight: 4,
                dashArray: corridor.status === "CRITICALLY_BLOCKED" ? "6, 8" : null,
                opacity: 0.85
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs text-xs space-y-1.5">
                  <div className="font-bold text-slate-100 flex items-center justify-between">
                    <span>{corridor.highway_number}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {corridor.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{corridor.corridor_name}</p>
                  <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700 text-[11px] text-slate-300">
                    <span className="font-semibold text-amber-400">Detour: </span>
                    {corridor.detour_advisory}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Patrol: {corridor.patrol_unit}
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Hotspot Markers & Hazard Radar Circles */}
        {hotspots.map((spot) => {
          const riskLevel = spot.current_risk?.risk_level || "MODERATE";
          const score = spot.current_risk?.risk_score || 50;
          const colorObj = RISK_COLOR_MAP[riskLevel] || RISK_COLOR_MAP.MODERATE;
          const isCritical = riskLevel === "CRITICAL";

          return (
            <React.Fragment key={spot.id}>
              {/* Outer Pulsing Threat Radius */}
              {showHeatCircles && (
                <CircleMarker
                  center={[spot.coordinates.latitude, spot.coordinates.longitude]}
                  radius={isCritical ? 26 : 16}
                  pathOptions={{
                    fillColor: colorObj.hex,
                    fillOpacity: isCritical ? 0.25 : 0.15,
                    color: colorObj.hex,
                    weight: isCritical ? 1.5 : 1,
                    dashArray: isCritical ? "4, 4" : null
                  }}
                />
              )}

              {/* Core Hotspot Pin */}
              <CircleMarker
                center={[spot.coordinates.latitude, spot.coordinates.longitude]}
                radius={isCritical ? 10 : 8}
                pathOptions={{
                  fillColor: colorObj.hex,
                  fillOpacity: 0.95,
                  color: "#FFFFFF",
                  weight: 2
                }}
                eventHandlers={{
                  click: () => onSelectHotspot(spot)
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-xs space-y-2">
                    {/* Hotspot Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-700 pb-1.5">
                      <div>
                        <div className="font-bold text-slate-100 text-sm leading-tight">{spot.name}</div>
                        <div className="text-[11px] text-slate-400">{spot.district}, {spot.state}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colorObj.badge}`}>
                        {score} / 100
                      </span>
                    </div>

                    {/* Meteorological & Geological Quick Telemetry */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                        <span>72h Rain: <strong className="text-white">{spot.weather.rainfall_72h}mm</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mountain className="w-3.5 h-3.5 text-amber-400" />
                        <span>Slope: <strong className="text-white">{spot.terrain.slope_deg}°</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                        <span>Soil Sat: <strong className="text-white">{spot.weather.soil_moisture_pct}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Elev: <strong className="text-white">{spot.terrain.elevation_m}m</strong></span>
                      </div>
                    </div>

                    {/* Primary Trigger Note */}
                    <div className="text-[11px] text-slate-300">
                      <span className="text-red-400 font-semibold">Primary Trigger: </span>
                      {spot.current_risk?.primary_trigger}
                    </div>

                    {/* Action Button: Open XAI Modal */}
                    <button
                      onClick={() => onOpenXAI(spot)}
                      className="w-full mt-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-1.5 px-3 rounded text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Explainable AI (XAI) Breakdown</span>
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Crowdsourced Field Incident Markers */}
        {showIncidents && incidents.map((inc) => (
          <CircleMarker
            key={inc.id}
            center={[inc.coordinates.latitude, inc.coordinates.longitude]}
            radius={7}
            pathOptions={{
              fillColor: "#F59E0B",
              fillOpacity: 0.9,
              color: "#FFFFFF",
              weight: 1.5
            }}
          >
            <Popup>
              <div className="p-1 max-w-xs text-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {inc.hazard_type}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium">
                    {inc.severity_level}
                  </span>
                </div>
                <div className="text-[11px] text-slate-200">{inc.location_name}</div>
                <p className="text-[11px] text-slate-300 italic">"{inc.notes}"</p>
                <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                  <span>Reported by: {inc.reporter_name}</span>
                  <span className="text-cyan-400">{inc.sync_source}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
