import React, { useState } from 'react';
import { 
  Radio, 
  X, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Users, 
  Phone, 
  Building2, 
  Clock,
  CheckCircle
} from 'lucide-react';
import { broadcastAlert } from '../services/api';

export default function AlertBroadcastCenter({ isOpen, onClose, alerts, onAlertBroadcasted }) {
  const [title, setTitle] = useState('RED WARNING: Severe Landslide Trigger Threat along NH-6 Sonapur Corridor');
  const [urgency, setUrgency] = useState('EMERGENCY_EVACUATION');
  const [selectedStates, setSelectedStates] = useState(['Meghalaya', 'Assam']);
  const [selectedAgencies, setSelectedAgencies] = useState(['SDMA', 'BRO', 'NDRF', 'PUBLIC_SMS']);
  const [corridors, setCorridors] = useState(['NH-6']);
  const [message, setMessage] = useState('Continuous heavy monsoon rainfall (>290mm in 72h) has triggered active mud slurry movement across Sonapur Tunnel KM 142.5. Total transit suspended. Civil evacuation ordered for downhill settlements.');
  const [actionRequired, setActionRequired] = useState('Deploy BRO excavators, halt heavy transport at Ladrymbai, activate DEOC emergency control rooms.');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);

  if (!isOpen) return null;

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);
    try {
      const payload = {
        title,
        urgency,
        target_states: selectedStates,
        target_agencies: selectedAgencies,
        corridors_affected: corridors,
        message,
        action_required: actionRequired
      };
      const res = await broadcastAlert(payload);
      setSuccessResponse(res);
      if (onAlertBroadcasted) onAlertBroadcasted(res.message_payload);
    } catch (err) {
      console.error("Alert broadcast failed:", err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Multi-Agency CAP Emergency Alert Broadcaster</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold uppercase">
                  MDoNER / NDMA Standard
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Common Alerting Protocol (CAP) dispatcher for SDMA, BRO, NDRF, and Public Cell Broadcasts.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successResponse ? (
          <div className="space-y-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>CAP Broadcast Dispatched Successfully!</span>
              </div>
              <div className="text-xs text-slate-300">
                CAP Identifier: <strong className="font-mono text-cyan-300">{successResponse.cap_message_id}</strong>
              </div>

              <div className="bg-slate-900/60 p-3 rounded border border-slate-700 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-200">Agency Dispatch Acknowledgements:</div>
                {Object.entries(successResponse.delivery_status || {}).map(([agency, status]) => (
                  <div key={agency} className="flex justify-between text-[11px] text-slate-300 border-b border-slate-800 pb-1">
                    <span>{agency}</span>
                    <span className="text-emerald-400 font-mono font-medium">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSuccessResponse(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Send Another Alert
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            {/* Urgency & Title */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium">Alert Level / Severity</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-xs focus:ring-2 focus:ring-red-500"
              >
                <option value="EMERGENCY_EVACUATION">🔴 RED: Critical Evacuation Alert (Imminent Collapse)</option>
                <option value="WARNING">🟠 ORANGE: Actionable Warning (High Hazard / Debris Watch)</option>
                <option value="WATCH">🟡 YELLOW: Elevated Watch (Heavy Rain Alert)</option>
                <option value="ADVISORY">🟢 GREEN: Advisory / All-Clear Update</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">CAP Alert Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Target Agencies */}
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
              <label className="block text-slate-200 font-semibold">Target Agency Broadcast Channels</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['SDMA', 'BRO', 'NDRF', 'PUBLIC_SMS'].map((agency) => (
                  <label key={agency} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAgencies.includes(agency)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedAgencies([...selectedAgencies, agency]);
                        else setSelectedAgencies(selectedAgencies.filter(a => a !== agency));
                      }}
                      className="rounded accent-red-500 w-3.5 h-3.5"
                    />
                    <span>{agency === 'PUBLIC_SMS' ? 'Cell Broadcast' : agency}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Emergency Advisory Description</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Required Operational Directives</label>
              <input
                type="text"
                value={actionRequired}
                onChange={(e) => setActionRequired(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBroadcasting}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-lg shadow-red-900/40"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{isBroadcasting ? "Broadcasting..." : "Dispatch Emergency CAP Alert"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
