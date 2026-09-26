import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Trophy, Award, Zap } from 'lucide-react';
import { DynamicIcon } from '../common/DynamicIcon';

export const StreaksSection: React.FC = () => {
  const { habits, longestStreak, setActiveTab } = useApp();

  // Sort habits by current streak descending
  const streakHabits = [...habits]
    .filter((h) => !h.paused && h.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            Active Streaks
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Consistency momentum across key routines
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Longest Record
          </span>
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
            <Trophy className="w-3 h-3" />
            {longestStreak} Days
          </span>
        </div>
      </div>

      {/* Streak Items List */}
      <div className="space-y-2.5 my-2">
        {streakHabits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/60 transition-transform hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
              >
                <DynamicIcon name={habit.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {habit.name}
                </p>
                <span className="text-[10px] text-slate-400">
                  Best: {habit.bestStreak} days
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-black text-xs shrink-0">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{habit.currentStreak} Days</span>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Earn +25 XP bonus for 7-day milestones
        </span>
        <button
          onClick={() => setActiveTab('rewards')}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View Badges →
        </button>
      </div>
    </div>
  );
};
