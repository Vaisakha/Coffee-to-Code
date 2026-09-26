import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react';
import { DynamicIcon } from '../common/DynamicIcon';

export const RewardsView: React.FC = () => {
  const { user, achievements, addToast } = useApp();

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100));
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleClaim = (achTitle: string, xp: number) => {
    addToast(`Reward Verified: "${achTitle}"`, `+${xp} XP has already been applied to your level.`, 'achievement');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Level Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-3xl font-black">{user.level}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                LEVEL
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Productivity Titan
                </h1>
                <span className="p-1 rounded-full bg-amber-400 text-slate-950">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-md">
                Earn XP by checking in daily habits, hitting 7+ day streaks, and finishing quarterly goals.
              </p>
            </div>
          </div>

          {/* XP Progress Capsule */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-emerald-200">Current Progress</span>
              <span>{user.currentXp} / {user.xpToNextLevel} XP</span>
            </div>

            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-300 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-emerald-100/70 text-right mt-1.5 font-medium">
              {user.xpToNextLevel - user.currentXp} XP to Level {user.level + 1}
            </p>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* XP Earning Mechanics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
            +25 XP
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Habit</p>
            <p className="text-[11px] text-slate-400">Per completion</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold">
            +50 XP
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Streak Milestone</p>
            <p className="text-[11px] text-slate-400">Every 7 days</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold">
            +15 XP
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Routine Item</p>
            <p className="text-[11px] text-slate-400">Per timeline block</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
            +150 XP
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Goal Crusher</p>
            <p className="text-[11px] text-slate-400">Quarterly targets</p>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Badges & Achievements</span>
            </h2>
            <p className="text-xs text-slate-400">
              {unlockedCount} of {achievements.length} badges unlocked
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
            {Math.round((unlockedCount / achievements.length) * 100)}% Collected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-300/60 dark:border-amber-500/30 shadow-sm hover:shadow-md'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                      ach.unlocked
                        ? 'bg-amber-100 dark:bg-amber-950/60 ring-2 ring-amber-400/40'
                        : 'bg-slate-200 dark:bg-slate-800 grayscale'
                    }`}
                  >
                    {ach.badge}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ach.unlocked
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center gap-1'
                    }`}
                  >
                    {ach.unlocked ? 'Unlocked ✓' : <><Lock className="w-3 h-3" /> Locked</>}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {ach.description}
                </p>
              </div>

              <div>
                {!ach.unlocked && (
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span>{ach.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                    +{ach.xpReward} XP
                  </span>

                  {ach.unlocked && (
                    <button
                      onClick={() => handleClaim(ach.title, ach.xpReward)}
                      className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      Showcase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
