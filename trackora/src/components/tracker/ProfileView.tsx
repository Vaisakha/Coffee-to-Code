import React, { useState } from 'react';
import {
  User,
  Mail,
  Flame,
  Trophy,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Bell,
  Volume2,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, resetDemoData, longestStreak } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [tagline, setTagline] = useState(user.tagline);
  const [weekStartsOn, setWeekStartsOn] = useState(user.weekStartsOn);
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled);
  const [smartReminders, setSmartReminders] = useState(user.smartReminders);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      tagline,
      weekStartsOn,
      soundEnabled,
      smartReminders,
    });
  };

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100));

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-emerald-500/10 p-6 rounded-3xl border border-purple-200/60 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
              L{user.level}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {user.name}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {user.levelTitle || 'Consistency Vanguard'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              “{user.tagline}”
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {user.email} • Trackora Member Since August 2026
            </p>
          </div>
        </div>

        {/* XP Summary Badge */}
        <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Level {user.level} Progress</span>
            <span className="text-emerald-600">{xpPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5 text-center">
            {user.currentXp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Check-ins</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{user.totalHabitsCompleted}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Logged routines</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Best Streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{longestStreak} Days</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Consecutive consistency</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Streak Shields</span>
            <Snowflake className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{user.streakFreezes} / {user.maxStreakFreezes}</p>
          <p className="text-[11px] text-sky-600 font-semibold mt-0.5">
            {user.streakFreezeActiveToday ? 'Protected Today' : 'Equipped'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Level</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">Level {user.level}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Next rank: Lvl {user.level + 1}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Account Preferences</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage personal information and notification habits</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 text-slate-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 text-slate-900 font-medium"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase">Tagline / Daily Affirmation</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Building a balanced, high-focus lifestyle"
              className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase">Week Starts On</label>
            <select
              value={weekStartsOn}
              onChange={(e) => setWeekStartsOn(e.target.value as any)}
              className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 text-slate-900 font-medium"
            >
              <option value="monday">Monday (Recommended)</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sound Effects</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={smartReminders}
                onChange={(e) => setSmartReminders(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Smart Reminders</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetDemoData}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
