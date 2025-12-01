import React, { useState } from 'react';
import { MeetingLog } from '../types';
import { MapPin, CheckCircle } from 'lucide-react';

interface MeetingFinderProps {
  logs: MeetingLog[];
  onCheckIn: () => void;
  onCheckOut: () => void;
}

export const MeetingFinder: React.FC<MeetingFinderProps> = ({ logs, onCheckIn, onCheckOut }) => {
  const [location, setLocation] = useState('');

  const searchMeetings = (type: string) => {
    const loc = (location || "near me").trim();
    const q = encodeURIComponent(`${type} meeting ${loc}`);
    window.open("https://www.google.com/maps/search/" + q, "_blank");
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Meeting Finder</h2>
        <p className="text-sm text-penda-light">Search Alcoholics Anonymous, Narcotics Anonymous, and Cocaine Anonymous meetings near you.</p>
      </header>

      {/* Search Card */}
      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <label className="block text-xs font-medium text-penda-light mb-1">City, ZIP, or Area</label>
        <div className="relative mb-4">
            <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Example: Frederick, MD"
                className="w-full p-2 border border-penda-border rounded-firm focus:outline-none focus:border-penda-purple pl-9"
            />
            <MapPin className="absolute left-3 top-2.5 text-penda-border" size={16} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => searchMeetings('AA')} className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm hover:bg-penda-light transition-colors">AA near me</button>
            <button onClick={() => searchMeetings('NA')} className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors">NA near me</button>
            <button onClick={() => searchMeetings('CA')} className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors">CA near me</button>
        </div>

        <h3 className="text-penda-purple font-bold text-sm mb-2">Official Meeting Sites</h3>
        <div className="flex gap-2">
            <a href="https://aa.org" target="_blank" className="text-xs bg-penda-bg text-penda-purple px-3 py-1.5 rounded-firm border border-penda-border hover:bg-white">AA.org</a>
            <a href="https://na.org" target="_blank" className="text-xs bg-penda-bg text-penda-purple px-3 py-1.5 rounded-firm border border-penda-border hover:bg-white">NA.org</a>
            <a href="https://ca.org" target="_blank" className="text-xs bg-penda-bg text-penda-purple px-3 py-1.5 rounded-firm border border-penda-border hover:bg-white">CA.org</a>
        </div>
      </div>

      {/* Meeting Log */}
      <div className="bg-white p-5 rounded-firm shadow-sm border border-penda-border">
        <h2 className="text-lg font-bold text-penda-purple mb-2">Meeting Log</h2>
        <div className="bg-penda-bg p-3 rounded-firm border border-dashed border-penda-light mb-4 text-xs text-penda-text">
            Your meeting history is saved securely to your local device.
        </div>

        <div className="flex gap-2 mb-4">
            <button onClick={onCheckIn} className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm flex items-center gap-2 hover:bg-penda-light">
                <CheckCircle size={16} /> Check In
            </button>
            <button onClick={onCheckOut} className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg">
                Check Out
            </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
            {logs.length === 0 ? <p className="text-penda-light text-sm italic">No logs yet.</p> : logs.map(log => (
                <div key={log.id} className="p-3 border border-penda-border rounded-firm bg-white flex justify-between items-center text-sm">
                    <span className="text-penda-text">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${log.type === 'Check-In' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{log.type}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
