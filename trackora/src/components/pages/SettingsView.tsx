import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Moon,
  Sun,
  Bell,
  Clock,
  Download,
  RotateCcw,
  Sparkles,
  Shield,
  Check,
  Calendar
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    theme,
    toggleTheme,
    resetDemoData,
    exportDataJson,
    setIsOnboardingOpen,
    addToast,
  } = useApp();

  const [name, setName] = useState(user.name);
  const [tagline, setTagline] = useState(user.tagline);
  const [email, setEmail] = useState(user.email);
  const [startOfDay, setStartOfDay] = useState(user.startOfDay);
  const [weekStartsOn, setWeekStartsOn] = useState(user.weekStartsOn);
  const [pushNotifs, setPushNotifs] = useState(user.pushNotifications);
  const [smartReminders, setSmartReminders] = useState(user.smartReminders);
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      tagline,
      email,
      startOfDay,
      weekStartsOn,
      pushNotifications: pushNotifs,
      smartReminders,
      soundEnabled,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Account & Application Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Personalize your identity, routine timing, theme preferences, and data
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl hover:bg-emerald-100 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Relaunch Setup Tour</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Settings (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>Personal Identity & Profile</span>
            </h2>

            {/* Avatar & Display */}
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
              />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Profile Avatar
                </p>
                <p className="text-[11px] text-slate-400">
                  Level {user.level} Titan • {user.totalHabitsCompleted} completed habits
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Personal Tagline / Daily Mantra
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Build better days, one habit at a time"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Routine Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Start of Day Window
                </label>
                <input
                  type="time"
                  value={startOfDay}
                  onChange={(e) => setStartOfDay(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Calibrates your morning habit reminders
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Week Starts On
                </label>
                <select
                  value={weekStartsOn}
                  onChange={(e) => setWeekStartsOn(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="monday">Monday (Productivity standard)</option>
                  <option value="sunday">Sunday (Traditional)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Affects weekly consistency charts
                </span>
              </div>
            </div>

            {/* Notifications & Audio toggles */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Push Notifications & Behavioral Alerts
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Receive gentle notifications 15m before scheduled focus blocks
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Smart AI Adaptive Reminders
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Allow Smart Coach to dynamically suggest schedule tweaks
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smartReminders}
                  onChange={(e) => setSmartReminders(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Theme & Data Management (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Appearance Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span>Theme & Appearance</span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              HabitFlow defaults to a calming emerald and slate palette. You can toggle between sleek dark mode and radiant light mode.
            </p>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Switch to Dark Theme</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Switch to Light Theme</span>
                </>
              )}
            </button>
          </div>

          {/* Data Export & Reset */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Data Management</span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export all your habits, schedule items, goal milestones, and consistency history as a standard JSON backup.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={exportDataJson}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export Data (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all HabitFlow data to original demo state? This will clear custom additions.')) {
                    resetDemoData();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 text-xs font-bold text-rose-700 dark:text-rose-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
