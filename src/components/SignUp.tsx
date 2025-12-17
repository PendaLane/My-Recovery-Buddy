import React, { useState } from 'react';
import { ShieldCheck, UserPlus, PhoneCall } from 'lucide-react';
import { UserProfile } from '../types';

interface SignUpProps {
  user: UserProfile;
  onSubmit: (profile: Partial<UserProfile>, password: string) => Promise<void> | void;
}

export const SignUp: React.FC<SignUpProps> = ({ user, onSubmit }) => {
  const [formState, setFormState] = useState({
    displayName: user.displayName || '',
    email: user.email || '',
    state: user.state || '',
    password: '',
    emergencyName: user.emergencyContact?.name || '',
    emergencyPhone: user.emergencyContact?.phone || '',
    emergencyRelation: user.emergencyContact?.relation || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          displayName: formState.displayName,
          email: formState.email,
          state: formState.state,
          emergencyContact: {
            name: formState.emergencyName,
            phone: formState.emergencyPhone,
            relation: formState.emergencyRelation,
          },
          isLoggedIn: true,
          joinedAt: user.joinedAt || new Date().toISOString(),
        },
        formState.password,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <UserPlus className="text-penda-purple" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-penda-purple">Create Your Account</h2>
          <p className="text-sm text-penda-light">We only ask for what keeps you safe. No addresses required.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-soft shadow-sm border border-penda-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm text-penda-text">
            Display Name
            <input
              value={formState.displayName}
              onChange={(e) => setFormState((prev) => ({ ...prev, displayName: e.target.value }))}
              className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
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
              required
            />
          </label>
          <label className="block text-sm text-penda-text">
            Password
            <input
              type="password"
              value={formState.password}
              onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
              placeholder="Create a password"
              minLength={8}
              required
            />
          </label>
          <label className="block text-sm text-penda-text">
            State
            <input
              value={formState.state}
              onChange={(e) => setFormState((prev) => ({ ...prev, state: e.target.value }))}
              className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
              placeholder="e.g., California"
              required
            />
          </label>
        </div>

        <div className="border border-dashed border-penda-border rounded-soft p-4">
          <div className="flex items-center gap-2 mb-3">
            <PhoneCall className="text-penda-purple" size={18} />
            <p className="text-sm font-semibold text-penda-purple">Emergency Contact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block text-sm text-penda-text">
              Name
              <input
                value={formState.emergencyName}
                onChange={(e) => setFormState((prev) => ({ ...prev, emergencyName: e.target.value }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
                required
              />
            </label>
            <label className="block text-sm text-penda-text">
              Relationship
              <input
                value={formState.emergencyRelation}
                onChange={(e) => setFormState((prev) => ({ ...prev, emergencyRelation: e.target.value }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
                placeholder="Friend, sponsor, parent..."
                required
              />
            </label>
            <label className="block text-sm text-penda-text">
              Phone Number
              <input
                value={formState.emergencyPhone}
                onChange={(e) => setFormState((prev) => ({ ...prev, emergencyPhone: e.target.value }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
                placeholder="555-123-4567"
                required
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-penda-purple text-white font-semibold py-3 rounded-firm shadow-md hover:shadow-lg transition-all disabled:opacity-70"
          disabled={isSubmitting}
        >
          <ShieldCheck size={18} />
          {isSubmitting ? 'Creating your membership...' : 'Create Account & Sign In'}
        </button>
      </form>
    </div>
  );
};
