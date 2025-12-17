import React from 'react';
import { Info } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Info className="text-penda-purple" size={22} />
        <div>
          <h2 className="text-2xl font-bold text-penda-purple">About My Recovery Buddy</h2>
          <p className="text-sm text-penda-light">Meetings. Sponsor. Support. In your pocket.</p>
        </div>
      </header>

      <div className="bg-white border border-penda-border rounded-soft p-5 shadow-sm space-y-6">
        <section className="space-y-2">
          <p className="text-sm text-penda-text/80 font-semibold">By Penda Lane Behavioral Health</p>
          <p className="text-sm text-penda-text/80">
            Recovery shouldn’t feel out of reach. My Recovery Buddy was built to keep encouragement, accountability, and community tools within arm’s reach—whether you’re just beginning, in treatment, or protecting long-term sobriety.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">Our purpose</h3>
          <p className="text-sm text-penda-text/80">
            Too many people navigate recovery alone. We designed this app to close that gap with practical support that fits in your pocket.
          </p>
          <div className="text-sm text-penda-text/80 space-y-1">
            <p className="font-semibold">Guiding principles</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Healing is stronger in community.</li>
              <li>Support should be accessible to everyone.</li>
              <li>Progress deserves encouragement, not judgment.</li>
              <li>Your recovery story belongs to you.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-penda-purple">What you can do here</h3>
          <p className="text-sm text-penda-text/80">Stay connected, stay accountable, and celebrate every win.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-penda-text/80">
            <ul className="list-disc pl-5 space-y-1">
              <li>Find A Meeting near you</li>
              <li>Log attendance for proof and personal records</li>
              <li>Stay close to your sponsor tools and contacts</li>
              <li>Work the steps with guided worksheets</li>
              <li>Journal privately with guided prompts</li>
              <li>Keep a quick-access phone book for support</li>
            </ul>
            <ul className="list-disc pl-5 space-y-1">
              <li>Read daily inspiration</li>
              <li>Earn badges and track streaks</li>
              <li>Explore treatment options in your state</li>
              <li>Use crisis resources the moment you need them</li>
              <li>Manage your profile and synced account settings</li>
            </ul>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">Own your journey</h3>
          <p className="text-sm text-penda-text/80">
            Track milestones, moods, and daily reflections so you can see your progress unfold. Every sober day counts—and we’ll help you celebrate it.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">Who it’s for</h3>
          <p className="text-sm text-penda-text/80">My Recovery Buddy welcomes anyone seeking support:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-penda-text/80">
            <li>People in recovery from substance use</li>
            <li>Sponsors and mentors guiding others</li>
            <li>Peers who want accountability and encouragement</li>
            <li>Loved ones who want to stay informed and connected</li>
          </ul>
          <p className="text-sm text-penda-text/80">Wherever you’re starting, this is a safe place to grow—and you never have to do it alone.</p>
        </section>
      </div>
    </div>
  );
};
