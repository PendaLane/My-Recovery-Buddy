import React, { useMemo, useState } from 'react';
import { MapPin, Sparkles, Wand2 } from 'lucide-react';

export const MeetingFinder: React.FC = () => {
  const [location, setLocation] = useState('');
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
    const loc = (location || "near me").trim();
    const q = encodeURIComponent(`${type} meeting ${loc}`);
    window.open("https://www.google.com/maps/search/" + q, "_blank");
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

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-penda-purple" size={18} />
          <h3 className="font-bold text-penda-purple text-sm">AI Quick Prompts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {aiPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => runAIPrompt(prompt)}
              className="flex items-center gap-2 text-left bg-penda-bg border border-penda-border px-3 py-2 rounded-firm text-sm hover:bg-white transition-colors"
            >
              <Wand2 size={16} className="text-penda-purple" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
