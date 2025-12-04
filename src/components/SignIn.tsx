import React, { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface SignInProps {
  user: UserProfile;
  onSubmit: (profile: Partial<UserProfile>) => void;
}

export const SignIn: React.FC<SignInProps> = ({ user, onSubmit }) => {
  const [formState, setFormState] = useState({
    email: user.email || '',
    displayName: user.displayName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email: formState.email,
      displayName: formState.displayName || 'Member',
      isLoggedIn: true,
      joinedAt: user.joinedAt || new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <LogIn className="text-penda-purple" size={22} />
        <div>
          <h2 className="text-2xl font-bold text-penda-purple">Sign in</h2>
          <p className="text-sm text-penda-light">Use your email to access your synced recovery data.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-soft shadow-sm border border-penda-border space-y-4 max-w-xl">
        <label className="block text-sm text-penda-text">
          Display Name
          <input
            value={formState.displayName}
            onChange={(e) => setFormState((prev) => ({ ...prev, displayName: e.target.value }))}
            className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
            placeholder="How should we greet you?"
            required
          />
        </label>
        <label className="block text-sm text-penda-text">
          Email
          <input
            type="email"
            value={formState.email}
            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
            placeholder="you@example.com"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-penda-purple text-white font-semibold py-3 rounded-firm shadow-md hover:shadow-lg transition-all"
        >
          <ShieldCheck size={18} /> Sign In
        </button>
      </form>
    </div>
  );
};
