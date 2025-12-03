import React, { useState } from 'react';
import { MapPin, Send, Sparkles, Wand2 } from 'lucide-react';

const quickIdeas = [
  'Find the closest beginner-friendly AA meeting',
  'Locate tonight’s NA speaker meeting near me',
  'Show CA meetings within 10 miles this weekend',
  'Find LGBTQ+ friendly recovery meetings nearby',
  'SMART Recovery meetings near me',
];

const directories = [
  { href: 'https://aa.org', label: 'AA.org (find local meetings)' },
  { href: 'https://www.smartrecovery.org/local/', label: 'SMART Recovery (meeting search)' },
  { href: 'https://na.org/meetingsearch/', label: 'NA.org (meeting search)' },
  { href: 'https://ca.org/meetings/', label: 'CA.org (meeting list)' },
];

export const MeetingFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [prompt, setPrompt] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const searchMeetings = (type: string) => {
    const loc = (location || 'near me').trim();
    const q = encodeURIComponent(`${type} meeting ${loc}`);

    try {
      window.open('https://www.google.com/maps/search/' + q, '_blank');
    } catch (err) {
      console.error('Unable to open search window', err);
      alert('Unable to open the search window. Please allow pop-ups or try again.');
    }
  };

  const useMyLocation = () => {
    if (!navigator?.geolocation) {
      setLocationError('Location services are not available in this browser.');
      return;
    }

    setLocationError(null);
    setLocating(true);
    setLocation('Locating...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordsLabel = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
        setLocation(coordsLabel);
        setLocating(false);
      },
      () => {
        setLocation('');
        setLocating(false);
        setLocationError('Unable to fetch your location. Please enter a city or ZIP instead.');
      }
    );
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    const loc = (location || 'near me').trim();
    const query = encodeURIComponent(
      `${prompt.trim()} recovery meeting options ${loc} with official listings, schedule, and address`
    );
    try {
      window.open('https://www.google.com/search?q=' + query, '_blank');
    } catch (err) {
      console.error('Unable to open search window', err);
      alert('Unable to open the search window. Please allow pop-ups or try again.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Find A Meeting</h2>
        <p className="text-sm text-penda-light">
          Search trusted directories or launch a location-aware Google search with clear wording.
        </p>
      </header>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border space-y-4">
        <div>
          <label className="block text-xs font-medium text-penda-light mb-1">City, ZIP, or Area</label>
          <div className="relative">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Example: Frederick, MD"
              className="w-full p-2 border border-penda-border rounded-firm focus:outline-none focus:border-penda-purple pl-9"
            />
            <MapPin className="absolute left-3 top-2.5 text-penda-border" size={16} />
          </div>
          <p className="text-[11px] text-penda-light mt-1">Allow location access for the quickest nearby results.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={useMyLocation}
            className="text-xs bg-penda-bg text-penda-purple border border-penda-border px-3 py-2 rounded-firm hover:bg-white transition-colors"
            disabled={locating}
          >
            {locating ? 'Locating…' : 'Use my location'}
          </button>
          <button
            onClick={() => searchMeetings('AA')}
            className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm hover:bg-penda-light transition-colors"
          >
            AA near me
          </button>
          <button
            onClick={() => searchMeetings('NA')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            NA near me
          </button>
          <button
            onClick={() => searchMeetings('CA')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            CA near me
          </button>
          <button
            onClick={() => searchMeetings('Smart Recovery')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            Smart Recovery near me
          </button>
        </div>

        {locationError && <p className="text-xs text-red-600">{locationError}</p>}

        <div>
          <h3 className="text-penda-purple font-bold text-sm mb-2">Official Meeting Sites</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {directories.map((site) => (
              <a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-penda-bg text-penda-purple px-3 py-3 rounded-firm border border-penda-border hover:bg-white text-center w-full"
              >
                {site.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-penda-purple" size={18} />
          <h3 className="font-bold text-penda-purple text-sm">Search with clear wording</h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Find a women’s-only AA meeting tonight in my city with wheelchair access"
              className="w-full border border-penda-border rounded-firm p-3 pr-12 text-sm focus:outline-none focus:border-penda-purple focus:ring-1 focus:ring-penda-purple min-h-[96px]"
            />
            <button
              onClick={handlePromptSubmit}
              disabled={!prompt.trim()}
              className="absolute right-3 bottom-3 bg-penda-purple text-white rounded-firm p-2 hover:bg-penda-light disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="text-xs text-penda-light">
            We’ll open a Google search using your wording plus your location to surface accurate meeting options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickIdeas.map((idea) => (
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
      </div>
    </div>
  );
};
