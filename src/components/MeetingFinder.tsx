import React, { useState } from 'react';
import { MapPin, Send } from 'lucide-react';

const directories = [
  { href: 'https://aa.org', label: 'Alcoholics Anonymous (AA)' },
  { href: 'https://na.org/meetingsearch/', label: 'Narcotics Anonymous (NA)' },
  { href: 'https://ca.org/meetings/', label: 'Cocaine Anonymous (CA)' },
  { href: 'https://www.smartrecovery.org/local/', label: 'SMART Recovery' },
  { href: 'https://recoverydharma.org/meetings', label: 'Recovery Dharma' },
];

export const MeetingFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');

  const launchSearch = (term: string) => {
    const loc = (location || 'near me').trim();
    const search = encodeURIComponent(`${term} meetings near ${loc}`);
    try {
      window.open(`https://www.google.com/maps/search/${search}`, '_blank');
    } catch (err) {
      console.error('Unable to open the search window', err);
      alert('Please allow pop-ups to search for meetings.');
    }
  };

  const handleCustomSearch = () => {
    if (!query.trim()) return;
    launchSearch(query.trim());
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Find A Meeting</h2>
        <p className="text-sm text-penda-light">Jump straight to official directories or search Google with your location.</p>
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
          <p className="text-[11px] text-penda-light mt-1">Add your city or ZIP for the most accurate nearby results.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {directories.map((site) => (
            <a
              key={site.href}
              href={site.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm bg-penda-bg text-penda-purple px-3 py-3 rounded-firm border border-penda-border hover:bg-white text-center w-full"
            >
              {site.label}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border space-y-3">
        <h3 className="text-sm font-bold text-penda-purple">Search Google for nearby meetings</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => launchSearch('AA')}
            className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm hover:bg-penda-light transition-colors"
          >
            AA near me
          </button>
          <button
            onClick={() => launchSearch('NA')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            NA near me
          </button>
          <button
            onClick={() => launchSearch('CA')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            CA near me
          </button>
          <button
            onClick={() => launchSearch('SMART Recovery')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            SMART Recovery near me
          </button>
          <button
            onClick={() => launchSearch('Recovery Dharma')}
            className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors"
          >
            Recovery Dharma near me
          </button>
        </div>

        <div className="relative mt-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Example: women’s-only AA meeting tonight with wheelchair access"
            className="w-full border border-penda-border rounded-firm p-3 pr-12 text-sm focus:outline-none focus:border-penda-purple focus:ring-1 focus:ring-penda-purple min-h-[96px]"
          />
          <button
            onClick={handleCustomSearch}
            disabled={!query.trim()}
            className="absolute right-3 bottom-3 bg-penda-purple text-white rounded-firm p-2 hover:bg-penda-light disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-penda-light">
          We’ll open a Google search with your wording plus your location so you see the closest options.
        </p>
      </div>
    </div>
  );
};
