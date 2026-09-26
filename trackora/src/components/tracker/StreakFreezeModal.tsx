import React from 'react';
import { X, Snowflake, ShieldCheck, Zap, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StreakFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakFreezeModal: React.FC<StreakFreezeModalProps> = ({ isOpen, onClose }) => {
  const { user, toggleStreakFreezeToday, buyStreakFreeze, longestStreak } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header with Icy Aesthetic */}
        <div className="p-6 bg-gradient-to-br from-sky-500 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
          {/* Icy Glow Orbs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20 blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-sky-300/20 blur-lg pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <Snowflake className="w-6 h-6 text-white animate-pulse-slow" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white">Streak Freeze Vault</h3>
                <p className="text-xs text-sky-100 font-medium">Protect your hard-earned consistency</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Inventory Card */}
          <div className="mt-5 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-sky-100 uppercase tracking-wider">Freeze Shields Available</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white">{user.streakFreezes}</span>
                <span className="text-xs text-sky-200 font-semibold">/ {user.maxStreakFreezes} equipped</span>
              </div>
            </div>

            {/* Shield Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-sky-900 font-bold text-xs shadow-sm">
              {user.streakFreezeActiveToday ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Shield Active Today</span>
                </>
              ) : (
                <>
                  <Snowflake className="w-4 h-4 text-sky-500" />
                  <span>Ready to Use</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Explanation */}
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">How Streak Freezes Work: </span>
              A streak freeze automatically safeguards your active streaks (including your {longestStreak}-day best streak) if you take a rest day, travel, or are unable to check in.
            </div>
          </div>

          {/* Toggle Freeze for Today */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Today's Protection</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {user.streakFreezeActiveToday
                  ? 'Your habits are shielded for today. No streaks will reset.'
                  : 'Activate freeze now to guarantee streaks remain intact today.'}
              </p>
            </div>

            <button
              onClick={toggleStreakFreezeToday}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                user.streakFreezeActiveToday
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {user.streakFreezeActiveToday ? 'Unequip Shield' : 'Activate Shield'}
            </button>
          </div>

          {/* Buy / Refill Freezes */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Restock Freeze Shield</p>
              <p className="text-[11px] text-slate-400">Restock +1 freeze token (Max {user.maxStreakFreezes})</p>
            </div>

            <button
              onClick={buyStreakFreeze}
              disabled={user.streakFreezes >= user.maxStreakFreezes}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                user.streakFreezes >= user.maxStreakFreezes
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Get Freeze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
