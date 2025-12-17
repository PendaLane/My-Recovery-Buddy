import React, { useState } from 'react';
import { Lock, Mail, BookOpen, Home as HomeIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface PublicShellProps {
  children: React.ReactNode;
}

const PublicShell: React.FC<PublicShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-penda-bg text-penda-text flex flex-col" id="top">
      <header className="w-full border-b border-penda-border/60 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="https://pendalane.com/wp-content/uploads/2024/04/cropped-Penda-Lane-Behavioral-Health-Logo.png"
              alt="Penda Lane Behavioral Health Logo"
              className="w-12 h-12 rounded-full object-cover bg-transparent"
            />
            <div className="leading-tight">
              <p className="font-extrabold text-penda-purple">My Recovery Buddy</p>
              <p className="text-xs text-penda-text/80">By Penda Lane Behavioral Health</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm font-semibold text-penda-purple">
            <a className="hover:text-penda-light transition-colors inline-flex items-center gap-1" href="#top">
              <HomeIcon size={14} /> Home
            </a>
            <a
              className="hover:text-penda-light transition-colors"
              href="https://pendalane.com/about/"
              target="_blank"
              rel="noreferrer"
            >
              About Us
            </a>
            <a
              className="hover:text-penda-light transition-colors"
              href="https://pendalane.com/resources/"
              target="_blank"
              rel="noreferrer"
            >
              Resources
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 space-y-8 text-center">
        {children}
      </main>
    </div>
  );
};

interface PublicLandingProps {
  onLogin: (profile: Partial<UserProfile>) => void;
  onStartSignUp: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onLogin, onStartSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      email,
      displayName: displayName || email.split('@')[0] || 'Member',
      isLoggedIn: true,
      joinedAt: new Date().toISOString(),
    });
  };

  return (
    <PublicShell>
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://pendalane.com/wp-content/uploads/2024/04/cropped-Penda-Lane-Behavioral-Health-Logo.png"
          alt="Penda Lane Behavioral Health Logo"
          className="w-28 h-28 rounded-full object-cover bg-transparent"
        />
        <h1 className="text-3xl font-extrabold text-penda-purple leading-tight">My Recovery Buddy</h1>
        <p className="text-sm text-penda-text/80 -mt-2">By Penda Lane Behavioral Health</p>
        <p className="text-lg font-semibold text-penda-purple">“Meetings. Sponsors. Support. In your pocket.”</p>
      </div>

      <p className="text-base text-penda-light max-w-2xl mx-auto">
        My Recovery Buddy keeps every part of your recovery journey together: find meetings, check in and out, log your visits
        with optional proof photos, keep a digital contact list for sponsors and peers, and store journals without relying on a
        single device. Everything is synced so it is ready whenever you sign in.
      </p>

      <div className="bg-white border border-penda-border rounded-soft shadow-sm max-w-xl w-full mx-auto p-6 space-y-5">
        <div className="flex items-center justify-center gap-2">
          <Lock className="text-penda-purple" size={18} />
          <h2 className="text-xl font-bold text-penda-purple">Log In</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="block text-sm text-penda-text">
            Email address
            <div className="mt-1 flex items-center gap-2 bg-white border border-penda-border rounded-firm px-3 py-2 focus-within:border-penda-purple">
              <Mail className="text-penda-light" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 focus:outline-none text-penda-text"
                placeholder="you@example.com"
                required
              />
            </div>
          </label>
          <label className="block text-sm text-penda-text">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
              placeholder="Enter your password"
              required
            />
          </label>
          <label className="block text-sm text-penda-text">
            Name for greetings (optional)
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
              placeholder="What should we call you?"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-penda-purple text-white font-semibold py-3 rounded-firm shadow-md hover:shadow-lg transition-all"
          >
            Log In
          </button>
        </form>
        <div className="text-sm text-penda-text/80 flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={onStartSignUp}
            className="text-penda-purple font-semibold hover:text-penda-light"
          >
            Don’t have an account? Sign up
          </button>
          <a
            href="https://pendalane.com/wp-login.php?action=lostpassword"
            target="_blank"
            rel="noreferrer"
            className="text-penda-text/70 hover:text-penda-purple"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div className="bg-white/60 border border-penda-border rounded-soft p-4 flex items-center justify-center gap-2 text-penda-purple text-sm max-w-xl mx-auto">
        <BookOpen size={16} />
        <span>Need more details? Visit the About Us and Resources pages from the menu above.</span>
      </div>
    </PublicShell>
  );
};

export const PublicShellWrapper = PublicShell;
