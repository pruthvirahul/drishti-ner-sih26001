import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Camera, 
  Send, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';
import { NER_STATES } from '../utils/constants';
import { submitIncident } from '../services/api';

export default function IncidentReportModal({ isOpen, onClose, onIncidentAdded, isOnline }) {
  const [reporterName, setReporterName] = useState('Sub-Divisional Officer / Citizen');
  const [reporterRole, setReporterRole] = useState('FIELD_OFFICER');
  const [state, setState] = useState('Meghalaya');
  const [district, setDistrict] = useState('East Jaintia Hills');
  const [locationName, setLocationName] = useState('NH-6 KM 142.5 Near Sonapur');
  const [latitude, setLatitude] = useState(25.1190);
  const [longitude, setLongitude] = useState(92.3685);
  const [hazardType, setHazardType] = useState('DEBRIS_FLOW');
  const [severity, setSeverity] = useState('SEVERE_BLOCKAGE');
  const [roadPassability, setRoadPassability] = useState('COMPLETELY_BLOCKED');
  const [notes, setNotes] = useState('Heavy mudflow across road surface; boulders falling from 40m height.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Auto Geotag using browser GPS
  const handleAutoGeotag = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(4)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(4)));
        },
        (err) => {
          console.warn("GPS lookup denied or unavailable:", err.message);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const report = {
        reporter_name: reporterName,
        reporter_role: reporterRole,
        contact_phone: "+91 94350 XXXXX",
        state: state,
        district: district,
        location_name: locationName,
        coordinates: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        hazard_type: hazardType,
        severity_level: severity,
        road_passability: roadPassability,
        photo_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        notes: notes,
        status: "VERIFIED_ALERT",
        sync_source: isOnline ? "ONLINE" : "OFFLINE_QUEUED"
      };

      const result = await submitIncident(report);
      setIsSuccess(true);
      if (onIncidentAdded) onIncidentAdded(result);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 p-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Geotagged Incident & Roadblock Reporting</span>
              {isOnline ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Online Sync
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline Queue Mode
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              For field officers, BRO engineers & citizens in low-connectivity NER regions.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-10 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-base font-bold text-white">Hazard Report Successfully Recorded!</div>
            <p className="text-xs text-slate-300">
              {isOnline ? "Incident dispatched to Disaster Management Center." : "Cached locally in IndexedDB. Will auto-sync when network reconnects."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Reporter & Role */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Reporter Name / Unit</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Designation / Role</label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="FIELD_OFFICER">Field Disaster Officer</option>
                  <option value="BRO_ENGINEER">BRO Highway Engineer</option>
                  <option value="POLICE_PATROL">Traffic / Police Patrol</option>
                  <option value="CITIZEN">Local Citizen / Commuter</option>
                </select>
              </div>
            </div>

            {/* Region & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  {NER_STATES.filter(s => s !== "All States").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">District / Milestone Location</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Geotagging GPS Coordinates */}
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GPS Geotagging (Coordinates)</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutoGeotag}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] hover:bg-cyan-500/30"
                >
                  📍 Grab Live Device GPS
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude (e.g. 25.1190)"
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude (e.g. 92.3685)"
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>
            </div>

            {/* Hazard Type & Road Blockage Severity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Hazard Category</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="DEBRIS_FLOW">Debris Flow / Mudslide</option>
                  <option value="ROCKFALL">Rockfall / Boulder Collapse</option>
                  <option value="ROAD_SUBSIDENCE">Road Subsidence / Sinking</option>
                  <option value="CRACK_DETECTION">Slope / Pavement Cracking</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Highway Passability Status</label>
                <select
                  value={roadPassability}
                  onChange={(e) => setRoadPassability(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="COMPLETELY_BLOCKED">Completely Blocked (0 Lanes)</option>
                  <option value="RESTRICTED_SLOW">Single Lane / Slow Transit</option>
                  <option value="FULLY_PASSABLE">Passable with Caution</option>
                </select>
              </div>
            </div>

            {/* Field Notes */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Observations / Required Machinery</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-cyan-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-900/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : isOnline ? "Transmit Report" : "Save Offline Draft"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
