import React, { useMemo, useState } from 'react';
import { Loader2, MapPin, Send, Sparkles, Wand2 } from 'lucide-react';
import { getAICoachResponse } from '../services/geminiService';

export const MeetingFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const aiPrompts = useMemo(
    () => [
      'Find the closest beginner-friendly AA meeting',
      'Locate tonight’s NA speaker meeting near me',
      'Show CA meetings within 10 miles this weekend',
      'Find LGBTQ+ friendly recovery meetings nearby',
    ],
    []
  );

  const searchMeetings = (type: string) => {
    const loc = (location || 'near me').trim();
    const q = encodeURIComponent(`${type} meeting ${loc}`);
    window.open('https://www.google.com/maps/search/' + q, '_blank');
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Location services are not available in this browser.');
      return;
    }

    setLocation('Locating...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordsLabel = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
        setLocation(coordsLabel);
      },
      () => {
        setLocation('');
        alert('Unable to fetch your location. Please enter a city or ZIP instead.');
      }
    );
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const composedPrompt = `${prompt.trim()} near ${location || 'my current location'}. Provide times, addresses, accessibility notes, and any online links if available.`;
    const response = await getAICoachResponse([], composedPrompt);
    setAiResponse(response);
    setIsLoading(false);
  };

  const runAIPrompt = (prompt: string) => {
    const loc = (location || 'my state').trim();
    const q = encodeURIComponent(`${prompt} in ${loc}`);
    window.open(`https://www.google.com/maps/search/${q}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Find A Meeting</h2>
        <p className="text-sm text-penda-light">Use AI-powered quick prompts or a manual search to reach the right room fast.</p>
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

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={useMyLocation}
            className="text-xs bg-penda-bg text-penda-purple border border-penda-border px-3 py-2 rounded-firm hover:bg-white transition-colors"
          >
            Use my location
          </button>
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

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-penda-purple" size={18} />
          <h3 className="font-bold text-penda-purple text-sm">Ask AI about meetings</h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell me the meeting type, day, or accessibility you need..."
              className="w-full border border-penda-border rounded-firm p-3 pr-12 text-sm focus:outline-none focus:border-penda-purple focus:ring-1 focus:ring-penda-purple min-h-[96px]"
            />
            <button
              onClick={handlePromptSubmit}
              disabled={isLoading || !prompt.trim()}
              className="absolute right-3 bottom-3 bg-penda-purple text-white rounded-firm p-2 hover:bg-penda-light disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            </button>
          </div>

          <p className="text-xs text-penda-light">AI will tailor suggestions using your location when provided.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {aiPrompts.map((idea) => (
            <button
              key={idea}
              onClick={() => setPrompt(idea)}
              className="flex items-center gap-2 text-left bg-penda-bg border border-penda-border px-3 py-2 rounded-firm text-sm hover:bg-white transition-colors"
            >
              <Wand2 size={16} className="text-penda-purple" />
              <span>{idea}</span>
            </button>
          ))}
        </div>

        {aiResponse && (
          <div className="bg-penda-bg p-3 rounded-firm border border-penda-border text-sm text-penda-text whitespace-pre-wrap">
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
};
