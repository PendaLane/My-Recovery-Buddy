import React from 'react';
import { Badge, Streak } from '../types';
import { Award, Flame } from 'lucide-react';

interface BadgesProps {
  badges: Badge[];
  streak: Streak;
}

export const Badges: React.FC<BadgesProps> = ({ badges, streak }) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Badges & Streaks</h2>
        <div className="bg-penda-bg p-3 rounded-firm border border-dashed border-penda-light mt-2 text-xs text-penda-text">
            Earn badges for showing up: logging meetings, journaling, and checking in consistently. Streaks are based on days you check in.
        </div>
      </header>

      {/* Streak Card */}
      <div className="bg-white p-6 rounded-soft shadow-sm border border-penda-border">
        <h3 className="text-lg font-bold text-penda-purple mb-4 flex items-center gap-2">
            <Flame className="text-orange-500" /> Your Streak
        </h3>
        {streak.current > 0 ? (
            <div className="text-center py-4">
                <div className="text-4xl font-extrabold text-penda-purple mb-1">{streak.current} Day{streak.current !== 1 && 's'}</div>
                <p className="text-penda-light text-sm">Current Check-in Streak</p>
                {streak.longest > 0 && (
                    <div className="mt-4 text-xs text-penda-light bg-penda-bg inline-block px-3 py-1 rounded-full">
                        Longest Streak: {streak.longest} Day{streak.longest !== 1 && 's'}
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center py-6">
                <p className="text-penda-text">No streak yet.</p>
                <p className="text-sm text-penda-light mt-1">Start by checking in from the Meeting Finder tab.</p>
            </div>
        )}
      </div>

      {/* Badges List */}
      <div className="bg-white p-6 rounded-soft shadow-sm border border-penda-border">
        <h3 className="text-lg font-bold text-penda-purple mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" /> Your Badges
        </h3>
        
        {badges.length === 0 ? (
            <p className="text-sm text-penda-light italic">No badges yet. Check in, journal, and join chat to start earning them.</p>
        ) : (
            <div className="flex flex-wrap gap-3">
                {badges.map(badge => (
                    <div key={badge.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-penda-purple bg-white shadow-sm">
                        <span className="text-lg">🏅</span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-penda-purple">{badge.label}</span>
                            <span className="text-[10px] text-penda-light opacity-70">{new Date(badge.earnedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
