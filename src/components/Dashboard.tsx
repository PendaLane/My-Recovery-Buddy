import React, { useState, useEffect } from 'react';
import { JournalEntry, UserProfile, View } from '../types';
import { Award, TrendingUp, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  sobrietyDate: string | null;
  setSobrietyDate: (date: string | null) => void;
  journals: JournalEntry[];
  streakCount: number;
  user: UserProfile | null;
  onNavigate?: (view: View) => void;
  onCreateAccount?: () => void;
  onToggleAuth?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ sobrietyDate, setSobrietyDate, journals, streakCount, user, onNavigate, onCreateAccount, onToggleAuth }) => {
  const [daysSober, setDaysSober] = useState(0);

  useEffect(() => {
    if (sobrietyDate) {
      const start = new Date(sobrietyDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      setDaysSober(Math.floor(diff / (1000 * 60 * 60 * 24)));
    } else {
      setDaysSober(0);
    }
  }, [sobrietyDate]);

  // Transform journal data for chart
  const chartData = journals.slice(-7).map(j => {
    let score = 3;
    if (j.mood === 'Great') score = 5;
    if (j.mood === 'Good') score = 4;
    if (j.mood === 'Okay') score = 3;
    if (j.mood === 'Struggling') score = 2;
    if (j.mood === 'Crisis') score = 1;
    return {
      date: new Date(j.date).toLocaleDateString(undefined, { weekday: 'short' }),
      score: score
    };
  }).reverse();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-penda-purple">
            {user?.isLoggedIn ? `Welcome, ${user.displayName}` : "Welcome to My Recovery Buddy"}
          </h2>
          <p className="text-penda-light text-sm">Meetings. Sponsor. Support. In your pocket.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCreateAccount?.()}
            className="bg-white text-penda-purple border border-penda-purple px-4 py-2 rounded-firm text-sm font-semibold hover:bg-penda-bg"
          >
            Create Account
          </button>
          <button
            onClick={() => onToggleAuth?.()}
            className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm font-semibold hover:bg-penda-light"
          >
            {user?.isLoggedIn ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Sobriety Counter Card */}
      <div className="bg-gradient-to-r from-penda-purple via-penda-light to-penda-tan rounded-soft p-6 text-white shadow-lg relative overflow-hidden border border-penda-purple">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award size={120} />
        </div>

        {!sobrietyDate ? (
          <div className="z-10 relative">
            <h3 className="text-lg font-bold mb-3">Begin Your Journey</h3>
            <div className="bg-white/10 p-4 rounded-firm border border-white/20 mb-4 backdrop-blur-sm">
              <p className="text-sm mb-3 font-medium">Save your sober date and jump into the tools that help you most—everything stays synced to My Recovery Buddy.</p>
              <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate?.(View.MEETINGS)}
                    className="flex-1 bg-white text-penda-purple py-2 rounded-firm text-sm font-bold flex items-center justify-center gap-2 hover:bg-penda-bg transition-colors"
                  >
                    <LogIn size={16} /> Find A Meeting
                  </button>
                  <button
                    onClick={() => onNavigate?.(View.JOURNAL)}
                    className="flex-1 bg-penda-purple border border-white/30 text-white py-2 rounded-firm text-sm font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-penda-purple transition-colors"
                  >
                    <UserPlus size={16} /> Start a Journal
                  </button>
              </div>
            </div>

              <label className="block text-xs uppercase tracking-wide opacity-80 mb-1">Set Clean/Sober Date (synced to My Recovery Buddy)</label>
            <input
              type="date" 
              className="w-full p-2 rounded-firm text-penda-purple font-bold border border-penda-border"
              onChange={(e) => setSobrietyDate(e.target.value)}
            />
          </div>
        ) : (
          <div className="z-10 relative text-center py-2">
            <div className="text-white/80 font-medium tracking-wider uppercase text-xs mb-1">Sobriety Streak</div>
            <div className="text-5xl font-extrabold mb-1">{daysSober}</div>
            <div className="text-lg text-white/90">Days Clean & Sober</div>
            <div className="mt-4 flex gap-2 justify-center">
               <button 
                onClick={() => setSobrietyDate(null)} 
                className="text-xs text-white/70 hover:text-white underline"
              >
                Reset Date
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-penda-purple" size={20} />
            <h3 className="font-bold text-penda-purple">Mood History</h3>
          </div>
          <div className="h-40 w-full">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b3a6f" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5b3a6f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5cfe0' }} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#5b3a6f"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    strokeWidth={2}
                  />
                  <XAxis dataKey="date" hide />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-penda-light text-sm italic">
                Log more journal entries to see trends.
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-penda-purple" size={20} />
            <h3 className="font-bold text-penda-purple">Your Stats</h3>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-penda-bg rounded-firm border border-penda-border">
                <span className="text-penda-text text-sm">Current Check-in Streak</span>
                <span className="font-bold text-penda-purple">{streakCount} Days</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-penda-bg rounded-firm border border-penda-border">
                <span className="text-penda-text text-sm">Total Journal Entries</span>
                <span className="font-bold text-penda-purple">{journals.length}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
