import React, { useState } from 'react';
import { Compass, HeartPulse, Map, Pill, Stethoscope, Sparkles } from 'lucide-react';

export const FindTreatment: React.FC = () => {
  const [state, setState] = useState('');
  const [selection, setSelection] = useState<string | null>(null);

  const cards = [
    { key: 'rehab', label: 'Addiction Rehabilitation Programs', icon: HeartPulse },
    { key: 'outpatient', label: 'Outpatient Treatment Programs', icon: Stethoscope },
    { key: 'meds', label: 'Medication Management', icon: Pill },
    { key: 'counseling', label: 'Addiction Counseling', icon: Compass },
  ];

  const handleSelect = (key: string) => {
    setSelection(key);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-penda-purple">Find Treatment (AI-guided)</h2>
          <p className="text-sm text-penda-light">Choose what you need and we’ll prep an AI-ready prompt you can copy for your state.</p>
        </div>
        <div className="flex items-center gap-2">
          <Map className="text-penda-purple" size={18} />
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Your state (e.g., CA)"
            className="w-40 p-2 rounded-firm border border-penda-border focus:border-penda-purple"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`flex items-center gap-3 p-4 rounded-soft border text-left shadow-sm transition-all ${
              selection === key ? 'border-penda-purple bg-penda-bg/70' : 'border-penda-border bg-white hover:border-penda-purple'
            }`}
          >
            <Icon className="text-penda-purple" size={22} />
            <div>
              <div className="font-semibold text-penda-purple">{label}</div>
              <div className="text-xs text-penda-light">Tap to draft an AI search focused on your state.</div>
            </div>
            <Sparkles className="text-penda-light ml-auto" size={18} />
          </button>
        ))}
      </div>

      {selection && (
        <div className="bg-white border border-penda-purple rounded-soft p-4 shadow-sm">
          <h3 className="font-bold text-penda-purple mb-2">Copy this prompt into the AI Companion</h3>
          <p className="text-sm text-penda-text whitespace-pre-wrap">
            {`Find top-rated ${cards.find(c => c.key === selection)?.label?.toLowerCase()} in ${state || 'my state'} with insurance-friendly options, peer-reviewed outcomes, and immediate intake availability. Share websites, phone numbers, and any crisis fast-tracks for someone seeking help today.`}
          </p>
          <p className="text-xs text-penda-light mt-2">Use the AI Companion tab to paste this prompt and get tailored listings.</p>
        </div>
      )}
    </div>
  );
};
