import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

export const Readings: React.FC = () => {
  const readings = [
    { title: 'Daily Reflections (AA)', url: 'https://www.aa.org/daily-reflections', desc: 'Alcoholics Anonymous' },
    { title: 'Just For Today (NA)', url: 'https://www.jftna.org/jft/', desc: 'Narcotics Anonymous' },
    { title: 'Thought for the Day', url: 'https://www.hazeldenbettyford.org/thought-for-the-day', desc: 'Hazelden Betty Ford' },
    { title: 'Our Daily Bread', url: 'https://odb.org', desc: 'Spiritual Inspiration' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Daily Readings</h2>
        <p className="text-sm text-penda-light">Tap a resource to jump to today's reading on the official site.</p>
      </header>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <div className="grid gap-4">
          {readings.map((reading, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-penda-border rounded-firm hover:bg-penda-bg transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-penda-bg text-penda-purple p-2 rounded-full">
                    <BookOpen size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-penda-text text-sm">{reading.title}</h3>
                    <p className="text-xs text-penda-light">{reading.desc}</p>
                </div>
              </div>
              <a 
                href={reading.url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white border border-penda-purple text-penda-purple px-3 py-1.5 rounded-firm text-xs flex items-center gap-1 hover:bg-penda-purple hover:text-white transition-colors"
              >
                Open <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
