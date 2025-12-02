import React, { useEffect, useMemo, useState } from 'react';
import { Compass, HeartPulse, Loader2, Map, Pill, Send, Stethoscope, Sparkles } from 'lucide-react';
import { getAICoachResponse } from '../services/geminiService';

export const FindTreatment: React.FC = () => {
  const [state, setState] = useState('');
  const [selection, setSelection] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cards = [
    { key: 'rehab', label: 'Addiction Rehabilitation Programs', icon: HeartPulse },
    { key: 'outpatient', label: 'Outpatient Treatment Programs', icon: Stethoscope },
    { key: 'meds', label: 'Medication Management', icon: Pill },
    { key: 'counseling', label: 'Addiction Counseling', icon: Compass },
  ];

  const handleSelect = (key: string) => {
    setSelection(key);
  };

  const promptTemplate = useMemo(
    () =>
      selection
        ? `Help me find ${cards.find((c) => c.key === selection)?.label?.toLowerCase()} in ${state || 'my state'} with insurance-friendly options, proximity, and admission details. Include phone numbers, websites, and any 24/7 contacts.`
        : `Help me find addiction treatment options in ${state || 'my state'} with clear contacts and next steps.`,
    [selection, state]
  );

  useEffect(() => {
    setPrompt(promptTemplate);
  }, [promptTemplate]);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const response = await getAICoachResponse([], prompt.trim());
    setAiResponse(response);
    setIsLoading(false);
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

      <div className="bg-white border border-penda-border rounded-soft p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-penda-purple" size={18} />
          <h3 className="font-bold text-penda-purple text-sm">Ask AI for treatment matches</h3>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[110px] border border-penda-border rounded-firm p-3 pr-12 text-sm focus:outline-none focus:border-penda-purple focus:ring-1 focus:ring-penda-purple"
            placeholder="Describe the care you need, coverage, or timing. Example: I need outpatient MAT options this week in my state."
          />
          <button
            onClick={handlePromptSubmit}
            disabled={isLoading || !prompt.trim()}
            className="absolute right-3 bottom-3 bg-penda-purple text-white rounded-firm p-2 hover:bg-penda-light disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>

        <p className="text-xs text-penda-light">Prompts auto-include your state for localized options.</p>

        {aiResponse && (
          <div className="bg-penda-bg border border-penda-border rounded-firm p-3 text-sm text-penda-text whitespace-pre-wrap">
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
};
