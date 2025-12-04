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

      <div className="bg-white border border-penda-border rounded-soft p-5 shadow-sm space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-penda-text/80 font-semibold">By Penda Lane Behavioral Health</p>
          <p className="text-sm text-penda-text/80">
            Recovery isn’t a solo journey — and you deserve support that’s available anytime, anywhere. My Recovery Buddy was created to make that possible.
          </p>
          <p className="text-sm text-penda-text/80">
            Built by Penda Lane Behavioral Health, this app brings together the most essential tools for recovery into one supportive, private, and easy-to-use space. Whether you’re newly starting the process, currently in treatment, or years into sobriety, we’re here to walk with you — one day at a time.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">Why We Built It</h3>
          <p className="text-sm text-penda-text/80">
            Too many people struggle alone when help is just out of reach. My Recovery Buddy bridges that gap by giving you access to community-driven recovery support — right from your phone.
          </p>
          <div className="text-sm text-penda-text/80 space-y-1">
            <p className="font-semibold">We believe:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Healing happens in community</li>
              <li>Everyone deserves access to support</li>
              <li>Progress should be celebrated, not judged</li>
              <li>Your recovery belongs to you</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">What’s Inside</h3>
          <p className="text-sm text-penda-text/80">Stay connected. Stay accountable. Stay encouraged.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-penda-text/80">
            <li>✔ Find A Meeting – Locate in-person or virtual recovery meetings near you</li>
            <li>✔ Meeting Log – Track where you’ve been and what you’ve accomplished</li>
            <li>✔ Sponsor Tools – Connect, share updates, and communicate seamlessly</li>
            <li>✔ Step Work – Work the steps at your own pace with digital worksheets</li>
            <li>✔ Journal – Express your thoughts and track your progress privately</li>
            <li>✔ Phone Book – Quickly reach peers, sponsor, and support contacts</li>
            <li>✔ Daily Readings – Inspiration and motivation every morning</li>
            <li>✔ AI Companion – A supportive check-in buddy when you need to talk*</li>
            <li>✔ Badges & Streaks – Celebrate milestones and consistency</li>
            <li>✔ Find Treatment – Browse trusted providers and programs</li>
            <li>✔ Help & Crisis Tools – Immediate resources when life feels heavy</li>
            <li>✔ Your Account Dashboard – Everything synced and backed up safely</li>
          </ul>
          <p className="text-[12px] text-penda-text/70">* The AI Companion is supportive but not a therapist. When in crisis, real help is just a tap away.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">Own Your Journey</h3>
          <p className="text-sm text-penda-text/80">
            Set your clean/sober date, reflect in daily journaling, monitor your mood, and watch your progress unfold. The more you use the app, the more it empowers you with insight into your wellness.
          </p>
          <p className="text-sm text-penda-text/80">Because every day clean is worth celebrating. 💪</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-penda-purple">We’re Here for You</h3>
          <p className="text-sm text-penda-text/80">
            My Recovery Buddy is made for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-penda-text/80">
            <li>People in recovery from substance use</li>
            <li>Anyone seeking accountability and peer support</li>
            <li>Sponsors and mentors supporting others</li>
            <li>Loved ones who want to understand and stay connected</li>
          </ul>
          <p className="text-sm text-penda-text/80">
            Wherever you’re starting — this is a safe place to grow.
          </p>
          <p className="text-sm text-penda-text/80">You are not alone. You are supported. You are stronger than you think.</p>
          <p className="text-sm font-semibold text-penda-purple">Join the community that believes in you. Start your journey with My Recovery Buddy today.</p>
        </div>
      </div>
    </div>
  );
};
