import React, { useState } from 'react';
import { X, Zap, Trophy, Sparkles, CheckCircle2, Gift, Star, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LevelXPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LevelXPModal: React.FC<LevelXPModalProps> = ({ isOpen, onClose }) => {
  const { user, awardXp, addToast } = useApp();
  const [claimedBonus, setClaimedBonus] = useState(false);

  if (!isOpen) return null;

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100));
  const xpRemaining = Math.max(0, user.xpToNextLevel - user.currentXp);

  const levelRoadmap = [
    { level: 1, title: 'Novice Builder', perk: 'Basic tracking & reminder schedules', unlocked: true },
    { level: 3, title: 'Momentum Seeker', perk: 'Custom habit icons & categories', unlocked: true },
    { level: 5, title: 'Focus Practitioner', perk: 'AI personalized routine recommendations', unlocked: true },
    { level: 6, title: 'Consistency Vanguard', perk: 'Streak Freeze Vault & recovery shields', unlocked: true, current: true },
    { level: 7, title: 'High Performer', perk: 'Advanced Heatmap matrix & export tools', unlocked: false },
    { level: 8, title: 'Zen Master', perk: 'Dynamic productivity & HRV correlations', unlocked: false },
    { level: 10, title: 'Legend of Habits', perk: 'VIP status, custom themes & master badge', unlocked: false },
  ];

  const handleClaimDailyBonus = () => {
    if (claimedBonus) return;
    setClaimedBonus(true);
    awardXp(60, 'Daily Consistency Login Bonus');
    addToast('🎁 Bonus Claimed!', '+60 XP added to your progression.', 'achievement');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 text-white relative overflow-hidden">
          {/* Glowing particle effects */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <Trophy className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">Level {user.level}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                    {user.levelTitle || 'Consistency Vanguard'}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  Building unstoppable consistency habits
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* XP Progress Bar Card */}
          <div className="mt-5 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span>Experience Points</span>
              <span>
                {user.currentXp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP ({xpPercent}%)
              </span>
            </div>

            {/* Bar */}
            <div className="w-full bg-black/25 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-300 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${xpPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-100 font-medium mt-2">
              <span>{xpRemaining} XP to Level {user.level + 1}</span>
              <span>{user.totalHabitsCompleted} Total Habit Check-ins</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Daily Bonus Claim Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">Daily Login XP Bonus</h4>
                <p className="text-[11px] text-amber-800">Claim your free +60 XP streak reward today</p>
              </div>
            </div>

            <button
              onClick={handleClaimDailyBonus}
              disabled={claimedBonus}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 ${
                claimedBonus
                  ? 'bg-amber-200 text-amber-800 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {claimedBonus ? '✓ Claimed' : 'Claim +60 XP'}
            </button>
          </div>

          {/* Level Roadmap */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Progression Roadmap & Perks
            </h4>

            <div className="space-y-2.5">
              {levelRoadmap.map((item) => (
                <div
                  key={item.level}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    item.current
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20'
                      : item.unlocked
                      ? 'bg-white border-slate-200/80'
                      : 'bg-slate-50/60 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        item.unlocked
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      L{item.level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        {item.current && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.perk}</p>
                    </div>
                  </div>

                  {item.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
