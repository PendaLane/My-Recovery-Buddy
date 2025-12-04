import React, { useMemo, useState } from 'react';
import { Compass, HeartPulse, Map, Pill, Send, Sparkles, Stethoscope } from 'lucide-react';

export const FindTreatment: React.FC = () => {
  const [state, setState] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selection, setSelection] = useState<string | null>(null);

  const cards = useMemo(
    () => [
      {
        key: 'rehab',
        label: 'Addiction Rehabilitation Programs',
        icon: HeartPulse,
        prompt: 'State-funded addiction rehab programs with immediate intake and medical detox',
      },
      {
        key: 'outpatient',
        label: 'Outpatient Treatment Programs',
        icon: Stethoscope,
        prompt: 'Outpatient treatment programs with evening groups and insurance verification',
      },
      {
        key: 'meds',
        label: 'Medication Management',
        icon: Pill,
        prompt: 'Medication-assisted treatment clinics offering buprenorphine and same-week appointments',
      },
      {
        key: 'counseling',
        label: 'Addiction Counseling',
        icon: Compass,
        prompt: 'Addiction counseling with certified counselors and sliding-scale pricing',
      },
    ],
    []
  );

  const buildQuery = (base?: string) => {
    const where = state ? `${state} state` : 'near me';
    const topic = base || prompt || 'addiction treatment options';
    return encodeURIComponent(`${topic} in ${where} with phone numbers, websites, and 24/7 intake info`);
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim() && !selection) return;
    const selectionPrompt = cards.find((c) => c.key === selection)?.prompt;
    const topic = selectionPrompt || prompt.trim();
    window.open('https://www.google.com/search?q=' + buildQuery(topic), '_blank');
  };

  const handleCardClick = (key: string, cardPrompt: string) => {
    setSelection(key);
    setPrompt(cardPrompt);
    window.open('https://www.google.com/search?q=' + buildQuery(cardPrompt), '_blank');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-penda-purple">Find Treatment</h2>
          <p className="text-sm text-penda-light">Use your state and a focused query to search for nearby care with clear contact details.</p>
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
        {cards.map(({ key, label, icon: Icon, prompt: cardPrompt }) => (
          <button
            key={key}
            onClick={() => handleCardClick(key, cardPrompt)}
            className={`flex items-center gap-3 p-4 rounded-soft border text-left shadow-sm transition-all ${
              selection === key ? 'border-penda-purple bg-penda-bg/70' : 'border-penda-border bg-white hover:border-penda-purple'
            }`}
          >
            <Icon className="text-penda-purple" size={22} />
            <div>
              <div className="font-semibold text-penda-purple">{label}</div>
              <div className="text-xs text-penda-light">Opens a Google search scoped to your state.</div>
            </div>
            <Sparkles className="text-penda-light ml-auto" size={18} />
          </button>
        ))}
      </div>

      <div className="bg-white border border-penda-border rounded-soft p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-penda-purple" size={18} />
          <h3 className="font-bold text-penda-purple text-sm">Search with precise wording</h3>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[110px] border border-penda-border rounded-firm p-3 pr-12 text-sm focus:outline-none focus:border-penda-purple focus:ring-1 focus:ring-penda-purple"
            placeholder="Example: 24/7 outpatient MAT program with same-day intake and insurance verification"
          />
          <button
            onClick={handlePromptSubmit}
            disabled={!prompt.trim() && !selection}
            className="absolute right-3 bottom-3 bg-penda-purple text-white rounded-firm p-2 hover:bg-penda-light disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="text-xs text-penda-light">We’ll open a Google search that combines your wording with your state so results stay local.</p>
      </div>

    </div>
  );
};
