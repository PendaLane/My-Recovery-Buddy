import React, { useEffect, useRef, useState } from 'react';
import { Camera, Bell, ShieldCheck, UserRound, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface MyAccountProps {
  user: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  stats: {
    streakCount: number;
    journalCount: number;
    meetingCount: number;
  };
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  onToggleAuth: () => void;
  onResetAccount: () => void;
}

export const MyAccount: React.FC<MyAccountProps> = ({
  user,
  onUpdateProfile,
  stats,
  notificationsEnabled,
  onToggleNotifications,
  onToggleAuth,
  onResetAccount,
}) => {
  const [formState, setFormState] = useState(user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const memberSince = formState.joinedAt
    ? new Date(formState.joinedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
    : '—';

  useEffect(() => {
    setFormState(user);
  }, [user]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const updateField = (key: keyof UserProfile, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdateProfile({
      ...formState,
      joinedAt: formState.joinedAt || new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-penda-border rounded-soft shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-6 md:text-left">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-penda-purple shadow-md flex items-center justify-center bg-penda-bg text-penda-purple font-bold text-xs leading-tight text-center px-2">
            {formState.avatar ? (
              <img src={formState.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>We Do Recover</span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-penda-purple text-white rounded-full p-2 shadow-lg"
              aria-label="Upload profile picture"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-penda-light text-center md:text-left">My Account</p>
            <h2 className="text-2xl font-bold text-penda-purple">{formState.displayName}</h2>
            <p className="text-sm text-penda-text/80">Member since {memberSince}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <button
                onClick={onToggleAuth}
                className="inline-flex items-center gap-2 bg-white text-penda-purple border border-penda-border px-3 py-2 rounded-firm text-sm font-semibold hover:bg-penda-bg"
              >
                <LogOut size={16} /> {user.isLoggedIn ? 'Sign Out' : 'Sign In'}
              </button>
              <button
                onClick={onResetAccount}
                className="inline-flex items-center gap-2 bg-penda-purple text-white px-3 py-2 rounded-firm text-sm font-semibold hover:bg-penda-light"
              >
                Clear my data
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-penda-text">Display Name</span>
              <input
                value={formState.displayName}
                onChange={(e) => updateField('displayName', e.target.value)}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple focus:ring-2 focus:ring-penda-light"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-penda-text">Homegroup</span>
              <input
                value={formState.homegroup || ''}
                onChange={(e) => updateField('homegroup', e.target.value)}
                placeholder="e.g., Tuesday Night Big Book"
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple focus:ring-2 focus:ring-penda-light"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-penda-text">Service Position</span>
              <input
                value={formState.servicePosition || ''}
                onChange={(e) => updateField('servicePosition', e.target.value)}
                placeholder="GSR, Treasurer, Chair, etc."
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple focus:ring-2 focus:ring-penda-light"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-penda-text">State</span>
              <input
                value={formState.state || ''}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="e.g., California"
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple focus:ring-2 focus:ring-penda-light"
              />
            </label>
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-penda-text">Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple focus:ring-2 focus:ring-penda-light"
              />
            </label>
          <div className="flex items-center justify-between p-3 rounded-firm border border-penda-border bg-penda-bg">
            <div>
              <p className="text-sm font-semibold text-penda-text">Enable Notifications</p>
              <p className="text-xs text-penda-text/70">Receive reminders and safety alerts for all features.</p>
            </div>
            <button
              onClick={() => onToggleNotifications(!notificationsEnabled)}
              className={`w-14 h-8 flex items-center rounded-full px-1 transition-colors ${
                notificationsEnabled ? 'bg-penda-purple' : 'bg-penda-border'
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="p-3 rounded-firm border border-penda-border bg-penda-bg flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-penda-border flex items-center justify-center text-penda-purple">
              <Bell size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-penda-text">Safety alerts</p>
              <p className="text-xs text-penda-text/70">Stay informed about reminders and session updates.</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-2 bg-penda-purple text-white font-semibold py-3 rounded-firm shadow-md hover:shadow-lg transition-all"
          >
              <ShieldCheck size={18} /> Save Profile
            </button>
          </div>
        </div>

        <div className="mt-6 border border-dashed border-penda-border rounded-soft p-4 bg-penda-bg/60">
          <p className="text-sm font-semibold text-penda-purple mb-2">Emergency Contact</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block text-sm text-penda-text">
              Name
              <input
                value={formState.emergencyContact?.name || ''}
                onChange={(e) => setFormState((prev) => ({
                  ...prev,
                  emergencyContact: { ...(prev.emergencyContact || { relation: '', phone: '' }), name: e.target.value },
                }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
              />
            </label>
            <label className="block text-sm text-penda-text">
              Relationship
              <input
                value={formState.emergencyContact?.relation || ''}
                onChange={(e) => setFormState((prev) => ({
                  ...prev,
                  emergencyContact: { ...(prev.emergencyContact || { name: '', phone: '' }), relation: e.target.value },
                }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
                placeholder="Friend, sponsor, family"
              />
            </label>
            <label className="block text-sm text-penda-text">
              Phone
              <input
                value={formState.emergencyContact?.phone || ''}
                onChange={(e) => setFormState((prev) => ({
                  ...prev,
                  emergencyContact: { ...(prev.emergencyContact || { name: '', relation: '' }), phone: e.target.value },
                }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border focus:border-penda-purple"
                placeholder="555-123-4567"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{
          label: 'Check-in Streak',
          value: `${stats.streakCount} days`,
          icon: <ShieldCheck size={22} />
        }, {
          label: 'Journal Entries',
          value: stats.journalCount,
          icon: <UserRound size={22} />
        }, {
          label: 'Meeting Logs',
          value: stats.meetingCount,
          icon: <Bell size={22} />
        }].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-penda-border rounded-soft p-4 shadow-sm flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-full bg-penda-soft flex items-center justify-center text-penda-purple">
              {item.icon}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-penda-text/70">{item.label}</p>
              <p className="text-lg font-bold text-penda-purple">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
