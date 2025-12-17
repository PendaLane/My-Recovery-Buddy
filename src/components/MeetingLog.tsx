import React, { useMemo, useState } from 'react';
import { MeetingLog as MeetingLogEntry } from '../types';
import { Camera, CheckCircle, Clock, Download, MapPin, Printer } from 'lucide-react';

interface MeetingLogProps {
  logs: MeetingLogEntry[];
  onCheckIn: (location: string, photoDataUrl?: string) => void;
  onCheckOut: (location: string, photoDataUrl?: string) => void;
}

export const MeetingLog: React.FC<MeetingLogProps> = ({ logs, onCheckIn, onCheckOut }) => {
  const [location, setLocation] = useState('');
  const [attachPhoto, setAttachPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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

  const getPhotoDataUrl = async () => {
    if (!attachPhoto || !photoFile) return undefined;
    return new Promise<string | undefined>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : undefined);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(photoFile);
    });
  };

  const handleCheck = async (type: 'in' | 'out') => {
    const photoDataUrl = await getPhotoDataUrl();
    if (type === 'in') {
      onCheckIn(safeLocation, photoDataUrl);
    } else {
      onCheckOut(safeLocation, photoDataUrl);
    }
    setPhotoFile(null);
    setAttachPhoto(false);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-penda-purple">Meeting Log</h2>
        <p className="text-sm text-penda-light">
          Keep a verified record of every meeting you attend. Checking in when you arrive and checking out when you leave stamps the date, time, and place so you can see it on a map and in your history later.
        </p>
        <p className="text-xs text-penda-text/80">
          This replaces the old paper log you had to carry around for signatures—now you can tap to record attendance and optionally attach a quick photo for proof if you want it.
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
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-center gap-2 text-xs text-penda-text">
              <input
                type="checkbox"
                checked={attachPhoto}
                onChange={(e) => setAttachPhoto(e.target.checked)}
                className="w-4 h-4 accent-penda-purple"
              />
              Add an optional proof photo
            </label>
            {attachPhoto && (
              <label className="flex items-center justify-center gap-2 text-xs text-penda-text bg-penda-bg border border-penda-border rounded-firm py-2 px-3 cursor-pointer hover:border-penda-purple">
                <Camera size={16} className="text-penda-purple" />
                <span>{photoFile ? photoFile.name : 'Take or upload a photo (optional)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCheck('in')}
              className="flex-1 bg-penda-purple text-white px-4 py-3 rounded-firm text-sm font-semibold shadow hover:bg-penda-light transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Check In
            </button>
            <button
              onClick={() => handleCheck('out')}
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
                  {log.photoDataUrl && (
                    <div className="mt-2 flex justify-center">
                      <img src={log.photoDataUrl} alt={`${log.type} proof`} className="w-24 h-24 object-cover rounded-firm border border-penda-border" />
                    </div>
                  )}
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
