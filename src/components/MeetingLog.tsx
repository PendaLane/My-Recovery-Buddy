import React, { useMemo, useState } from 'react';
import { MeetingLog as MeetingLogEntry } from '../types';
import { CheckCircle, Clock, Download, MapPin, Printer } from 'lucide-react';

interface MeetingLogProps {
  logs: MeetingLogEntry[];
  onCheckIn: (location: string) => void;
  onCheckOut: (location: string) => void;
}

export const MeetingLog: React.FC<MeetingLogProps> = ({ logs, onCheckIn, onCheckOut }) => {
  const [location, setLocation] = useState('');

  const orderedLogs = useMemo(() => logs, [logs]);

  const handleExport = () => {
    const header = 'Timestamp,Type,Location';
    const rows = orderedLogs
      .map((log) => {
        const time = new Date(log.timestamp).toLocaleString();
        const loc = log.location ? log.location.replace(/,/g, ';') : 'Location not recorded';
        return `${time},${log.type},${loc}`;
      })
      .join('\n');

    const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meeting-log.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const safeLocation = location.trim() || 'Location not recorded';

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-penda-purple">Meeting Log</h2>
        <p className="text-sm text-penda-light">
          Track every meeting you attend. Checking in and out stamps the date, time, and location so you can export and print a clean attendance record when you need proof.
        </p>
      </header>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="block text-sm text-penda-text">
            Meeting Location or Format
            <div className="relative mt-1">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Example: Serenity Group, Frederick MD or Zoom"
                className="w-full p-3 rounded-firm border border-penda-border focus:border-penda-purple pl-10"
              />
              <MapPin className="absolute left-3 top-3 text-penda-border" size={16} />
            </div>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onCheckIn(safeLocation)}
              className="flex-1 bg-penda-purple text-white px-4 py-3 rounded-firm text-sm font-semibold shadow hover:bg-penda-light transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Check In
            </button>
            <button
              onClick={() => onCheckOut(safeLocation)}
              className="flex-1 bg-white border border-penda-purple text-penda-purple px-4 py-3 rounded-firm text-sm font-semibold hover:bg-penda-bg transition-colors"
            >
              Check Out
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 bg-white border border-penda-border text-penda-text px-4 py-3 rounded-firm text-sm font-semibold hover:bg-penda-bg transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-penda-tan text-penda-purple border border-penda-border px-4 py-3 rounded-firm text-sm font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Printer size={16} /> Print Log
            </button>
          </div>
        </div>
        <p className="text-xs text-penda-light">Your check-ins and check-outs are saved securely in My Recovery Buddy so you can export them anytime.</p>
      </div>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-penda-purple" size={20} />
          <h3 className="font-bold text-penda-purple">Recent Activity</h3>
        </div>
        {orderedLogs.length === 0 ? (
          <p className="text-sm text-penda-light italic">No logs yet. Check in to record your first meeting.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {orderedLogs.map((log) => (
              <div key={log.id} className="p-3 border border-penda-border rounded-firm bg-penda-bg flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm">
                <div>
                  <div className="font-semibold text-penda-text">{log.type}</div>
                  <div className="text-xs text-penda-light">{log.location || 'Location not recorded'}</div>
                </div>
                <div className="text-xs text-penda-text">{new Date(log.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
