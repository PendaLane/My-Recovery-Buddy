import React, { useState } from 'react';
import { MapPin, ExternalLink, Send } from 'lucide-react';

export const MeetingFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');

  // --- THESE ARE THE MISSING FUNCTIONS WE ADDED ---
  const handleCustomSearch = () => {
    if (!query.trim()) return;
    const loc = (location || "near me").trim();
    // Opens a google search with the custom query + location
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query + ' ' + loc)}`, '_blank');
  };

  const meetingPathways = [
    {
      heading: '12-Step',
      description: 'Time-tested fellowships that use the Twelve Steps to support sobriety and service.',
      items: [
        { name: 'Alcoholics Anonymous (AA)', url: 'https://www.aa.org/', blurb: 'Peer-led fellowship for people who want to stop drinking.' },
        { name: 'Narcotics Anonymous (NA)', url: 'https://www.na.org/', blurb: 'Support for anyone seeking recovery from drug use.' },
        { name: 'Cocaine Anonymous (CA)', url: 'https://ca.org/', blurb: 'Men and women who share experience, strength, and hope to recover from addiction.' },
        { name: 'Adult Children of Alcoholics (ACA)', url: 'https://adultchildren.org/', blurb: 'Twelve Step fellowship for those raised in alcoholic or otherwise dysfunctional homes.' },
        { name: 'Dual Recovery Anonymous (DRA)', url: 'http://www.draonline.org', blurb: 'Peer community for people managing both addiction and mental health conditions.' },
      ],
    },
    {
      heading: 'Secular (Non-Religious)',
      description: 'Evidence-based and self-empowering pathways that do not use spiritual language.',
      items: [
        { name: 'LifeRing Secular Recovery', url: 'https://www.lifering.org/', blurb: 'Practical, peer-driven sobriety support with respect for every individual path.' },
        { name: 'SMART Recovery', url: 'https://www.smartrecovery.org/', blurb: 'Science-backed tools and meetings that build motivation, resilience, and balance.' },
      ],
    },
    {
      heading: 'Spiritual / Religious',
      description: 'Faith-informed options that blend recovery with spiritual practice.',
      items: [
        { name: 'White Bison Wellbriety', url: 'https://whitebison.org/', blurb: 'Native-led healing resources and circles for sobriety and wellness.' },
        { name: 'Recovery Dharma', url: 'https://recoverydharma.org', blurb: 'Buddhist-inspired peer community using the Dharma to heal from addiction.' },
        { name: 'Refuge Recovery', url: 'https://refugerecovery.org/', blurb: 'Meditation-focused program grounded in Buddhist principles for freedom from addiction.' },
        { name: 'Celebrate Recovery', url: 'https://www.celebraterecovery.com/', blurb: 'Christ-centered 12-Step recovery for anyone facing hurts, habits, or hang-ups.' },
        { name: 'Alcoholics for Christ', url: 'https://www.alcoholicsforchrist.com/', blurb: 'Inter-denominational fellowship supporting substance users, families, and adult children.' },
        { name: 'Pioneer Association', url: 'https://www.pioneers.ie/', blurb: 'International Roman Catholic teetotaler community encouraging abstinence.' },
      ],
    },
    {
      heading: 'Medication Assisted Treatment (MAT)',
      description: 'FDA-approved medications like methadone, buprenorphine, and naltrexone paired with counseling.',
      items: [
        { name: 'Find MAT Providers Nationwide', url: 'https://findtreatment.gov/', blurb: 'Search for MAT programs and clinics in your state.' },
      ],
    },
    {
      heading: 'Wellness Based Recovery',
      description: 'Mind-body approaches such as yoga, meditation, tai chi, and mindful movement.',
      items: [
        { name: 'Recovery 2.0', url: 'https://r20.com/', blurb: 'Global community blending spiritual traditions, the Twelve Steps, and daily practices.' },
      ],
    },
    {
      heading: 'Active Sober Community',
      description: 'Fitness- and outdoors-focused communities that pair activity with recovery support.',
      items: [
        { name: 'The Phoenix', url: 'https://thephoenix.org/', blurb: 'Sober active community offering events, classes, and connection.', },
        { name: 'ROCovery Fitness', url: 'https://www.rocoveryfitness.org/', blurb: 'Wellness and peer connection through fitness and outdoor activities.', },
        { name: 'Fit To Recover', url: 'https://www.fit2recover.org/', blurb: 'Community that blends fitness, nutrition, creative arts, and service.', },
      ],
    },
    {
      heading: 'Online Recovery Supports',
      description: 'Virtual-first communities that make it easy to connect from anywhere.',
      items: [
        { name: 'In The Rooms', url: 'https://www.intherooms.com/home/', blurb: 'Global online recovery community with live meetings and discussion groups.', },
      ],
    },
  ];

  const searchMeetings = (type: string) => {
    const loc = (location || "near me").trim();
    const q = encodeURIComponent(`${type} meeting ${loc}`);
    window.open("https://www.google.com/maps/search/" + q, "_blank");
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Find A Meeting</h2>
        <p className="text-sm text-penda-light">Use your location or a nearby city to pull official meeting options instantly.</p>
        <div className="mt-2 text-xs text-penda-text italic border-l-4 border-penda-purple pl-3">
          “There are multiple pathways of addiction recovery and all are cause for celebration” — William White
        </div>
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

        <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => searchMeetings('AA')} className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm hover:bg-penda-light transition-colors">AA near me</button>
            <button onClick={() => searchMeetings('NA')} className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors">NA near me</button>
            <button onClick={() => searchMeetings('CA')} className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors">CA near me</button>
            <button onClick={() => searchMeetings('SMART Recovery')} className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm hover:bg-penda-bg transition-colors">SMART Recovery near me</button>
        </div>
      </div>

      {/* Pathways Overview */}
      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border space-y-6">
        <div>
          <h3 className="text-lg font-bold text-penda-purple mb-1">Pathways of Recovery</h3>
          <p className="text-sm text-penda-light">Explore official directories and communities across spiritual, secular, wellness, and medication-assisted options.</p>
        </div>

        <div className="space-y-5">
          {meetingPathways.map((section) => (
            <div key={section.heading} className="border border-penda-border rounded-firm p-4 bg-penda-bg/50">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-base font-semibold text-penda-purple">{section.heading}</h4>
                  <p className="text-xs text-penda-light leading-relaxed">{section.description}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {section.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    className="flex items-start gap-3 bg-white border border-penda-border rounded-firm p-3 hover:shadow-sm transition-shadow"
                    rel="noreferrer"
                  >
                    <div className="w-8 h-8 rounded-full bg-penda-bg flex items-center justify-center text-penda-purple">
                      <ExternalLink size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-penda-text text-sm leading-tight">{item.name}</div>
                      <p className="text-xs text-penda-light leading-relaxed">{item.blurb}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-firm shadow-sm border border-penda-border space-y-3">
        <h2 className="text-lg font-bold text-penda-purple">Custom Search</h2>
        <p className="text-sm text-penda-light">Use your own words to find the exact format, accessibility, or vibe you want.</p>
        <div className="relative">
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
