import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Sparkles,
  MessageSquare,
  Bell,
  Heart,
  Zap,
  ChevronDown,
  ArrowUpRight,
  Send,
  Snowflake,
  Trophy,
  Home,
  Flame,
  Activity,
  User,
  Info,
  Clock,
  CheckCircle2,
  Calendar,
  Sun,
  Moon,
  BookOpen,
  Brain,
  Droplets,
  Dumbbell,
  Apple,
  PenTool,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  Milestone,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyWinsCard } from './DailyWinsCard';
import { HabitHeatmapCard } from './HabitHeatmapCard';
import { CalorieMeterView } from './CalorieMeterView';
import { PhysicalDetailsView } from './PhysicalDetailsView';
import { ProfileView } from './ProfileView';
import { AboutView } from './AboutView';
import { DynamicIcon } from '../common/DynamicIcon';

interface DashboardMainProps {
  onOpenAskAI?: () => void;
  onOpenAddTasks?: () => void;
  onOpenNotifications?: () => void;
  onOpenChat?: () => void;
  onOpenStreakFreeze?: () => void;
  onOpenLevelXP?: () => void;
}

export const DashboardMain: React.FC<DashboardMainProps> = ({
  onOpenAskAI,
  onOpenAddTasks,
  onOpenNotifications,
  onOpenChat,
  onOpenStreakFreeze,
  onOpenLevelXP,
}) => {
  const {
    user,
    habits,
    toggleHabitToday,
    rescheduleHabit,
    addToast,
    setIsCreateHabitOpen,
    currentTrackerView,
    setCurrentTrackerView,
    todayCompletionRate,
    habitsCompletedTodayCount,
    totalActiveHabitsCount,
    productivityScore,
    longestStreak,
    setActiveTab,
    readyToRevisitCount,
    resurfacedVaultCount,
  } = useApp();

  // Date selection state
  const weekDays = [
    { day: 'Sat', date: 20 },
    { day: 'Sun', date: 21 },
    { day: 'Mon', date: 22 },
    { day: 'Tue', date: 23 },
    { day: 'Wed', date: 24 },
    { day: 'Thu', date: 25 },
    { day: 'Fri', date: 26 },
  ];
  const [selectedDayNumber, setSelectedDayNumber] = useState(26);

  // Adaptive Routine Banner state
  const [adaptiveState, setAdaptiveState] = useState<'prompt' | 'rescheduled' | 'skipped' | 'moved'>('prompt');
  const [rescheduledTime, setRescheduledTime] = useState<string>('7:30 PM');

  // Habit Streak View Mode
  const [streakMode, setStreakMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedStreakDay, setSelectedStreakDay] = useState(26);

  const streakDays = [
    { day: 12, status: 'checked' },
    { day: 13, status: 'checked' },
    { day: 14, status: 'checked' },
    { day: 15, status: 'checked' },
    { day: 16, status: 'checked' },
    { day: 17, status: 'checked' },
    { day: 18, status: 'checked' },
    { day: 19, status: 'checked' },
    { day: 20, status: 'checked' },
    { day: 21, status: 'checked' },
    { day: 22, status: 'checked' },
    { day: 23, status: 'checked' },
    { day: 24, status: 'checked' },
    { day: 25, status: 'checked' },
    { day: 26, status: 'active' },
    { day: 27, status: 'future' },
    { day: 28, status: 'future' },
  ];

  // Favourite Habit Bar Chart Data
  const habitBars = [
    { name: 'Hydration', height: 92, active: false, time: '2.5 L', change: '+2%' },
    { name: 'Workout', height: 88, active: false, time: '40 min', change: '+5%' },
    { name: 'Meditation', height: 94, active: true, time: '10 min', change: '▲ 4% vs last month' },
    { name: 'Deep Work', height: 85, active: false, time: '90 min', change: '+8%' },
    { name: 'Reading', height: 88, active: false, time: '20 pgs', change: '+3%' },
    { name: 'Journaling', height: 70, active: false, time: '1 entry', change: '+1%' },
  ];
  const [selectedBar, setSelectedBar] = useState(2); // Meditation

  // Journaling input
  const [journalSummary, setJournalSummary] = useState('');

  const handleSaveJournal = () => {
    if (!journalSummary.trim()) {
      addToast('Daily Journal', 'Please enter your reflection for today.', 'info');
      return;
    }
    addToast('Journal Entry Saved ✨', 'Added to your daily reflections (+20 XP).', 'success');
    setJournalSummary('');
  };

  // Group habits into morning, afternoon, evening
  const morningHabits = habits.filter(
    (h) => h.preferredTimeOfDay === 'morning' || (h.reminderTime && parseInt(h.reminderTime.split(':')[0]) < 12)
  );
  const afternoonHabits = habits.filter(
    (h) =>
      h.preferredTimeOfDay === 'afternoon' ||
      (h.reminderTime && parseInt(h.reminderTime.split(':')[0]) >= 12 && parseInt(h.reminderTime.split(':')[0]) < 17)
  );
  const eveningHabits = habits.filter(
    (h) =>
      h.preferredTimeOfDay === 'evening' ||
      h.preferredTimeOfDay === 'anytime' ||
      (h.reminderTime && parseInt(h.reminderTime.split(':')[0]) >= 17)
  );

  const handleAdaptiveAction = (action: 'reschedule' | 'skip' | 'tomorrow') => {
    if (action === 'reschedule') {
      rescheduleHabit('habit-8', '19:30');
      setAdaptiveState('rescheduled');
      setRescheduledTime('7:30 PM');
    } else if (action === 'skip') {
      setAdaptiveState('skipped');
      addToast('Habit Skipped', 'Study session marked skipped for today.', 'info');
    } else if (action === 'tomorrow') {
      setAdaptiveState('moved');
      addToast('Moved to Tomorrow', 'Study session scheduled for tomorrow 5:00 PM.', 'info');
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-5">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentTrackerView === 'home' && 'Plan your day. Build better habits. Stay consistent.'}
              {currentTrackerView === 'calories' && 'Calorie Meter'}
              {currentTrackerView === 'physical' && 'Physical Details'}
              {currentTrackerView === 'profile' && 'My Profile'}
              {currentTrackerView === 'about' && 'About Trackora'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
            {currentTrackerView === 'home' && (
              <>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  Daily Routine
                </span>
                <span>Your personalized routine, one day at a time.</span>
              </>
            )}
            {currentTrackerView === 'calories' && 'Daily energy expenditure & macro balance'}
            {currentTrackerView === 'physical' && 'Biometrics, BMI, and body composition'}
            {currentTrackerView === 'profile' && 'Manage personal account & routine preferences'}
            {currentTrackerView === 'about' && 'Trackora architecture & behavioral philosophy'}
          </p>
        </div>

        {/* Right Nav Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Streak Freeze Status Pill */}
          <button
            onClick={onOpenStreakFreeze}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border ${
              user.streakFreezeActiveToday
                ? 'bg-sky-50 border-sky-300 text-sky-700 ring-2 ring-sky-300/40'
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-sky-50/50 hover:border-sky-200'
            }`}
            title="Streak Freeze Vault"
          >
            <Snowflake className={`w-3.5 h-3.5 ${user.streakFreezeActiveToday ? 'text-sky-600 animate-spin-slow' : 'text-sky-500'}`} />
            <span>
              {user.streakFreezeActiveToday ? 'Shield Active' : `${user.streakFreezes} Freezes`}
            </span>
          </button>

          {/* Level & XP Progression Pill */}
          <button
            onClick={onOpenLevelXP}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs hover:bg-emerald-50/40 hover:border-emerald-200 transition-all text-xs font-bold text-slate-800"
            title={`Level ${user.level} (${Math.round((user.currentXp / user.xpToNextLevel) * 100)}% XP)`}
          >
            <div className="flex items-center gap-1 text-emerald-600">
              <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>Lvl {user.level}</span>
            </div>
            {/* Mini XP Bar */}
            <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100))}%` }}
              />
            </div>
          </button>

          {/* Ask AI Button */}
          <button
            onClick={onOpenAskAI}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all text-xs font-bold text-slate-800"
          >
            <div className="w-4 h-4 rounded-full p-[1.5px] bg-gradient-to-tr from-pink-500 via-amber-400 to-emerald-400 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-purple-600" />
              </div>
            </div>
            <span>Ask AI</span>
          </button>

          {/* Chat Bubble Button */}
          <button
            onClick={onOpenChat}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors"
            title="Chat & Community"
          >
            <MessageSquare className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* Alex Profile Avatar & Name */}
          <button
            onClick={() => setCurrentTrackerView('profile')}
            className={`flex items-center gap-2 pl-1 select-none hover:opacity-85 transition-opacity ${
              currentTrackerView === 'profile' ? 'ring-2 ring-purple-500 rounded-full pr-2' : ''
            }`}
            title="View Profile & Settings"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
              alt="Alex Vance"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">
              Alex Vance
            </span>
          </button>
        </div>
      </div>

      {/* Modern Tracker Navigation Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto custom-scrollbar select-none">
        <button
          onClick={() => setCurrentTrackerView('home')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'home'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('calories')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'calories'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Calorie Meter</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('physical')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'physical'
              ? 'bg-white text-teal-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Physical Details</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'profile'
              ? 'bg-white text-purple-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setCurrentTrackerView('about')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentTrackerView === 'about'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About</span>
        </button>

        <button
          onClick={() => setActiveTab('almost-list')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-white/50 transition-all shrink-0"
        >
          <Milestone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Almost List</span>
          {readyToRevisitCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-white/50 transition-all shrink-0"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Unsent Vault</span>
          {resurfacedVaultCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Conditionally Render Active View */}
      {currentTrackerView === 'calories' && <CalorieMeterView />}
      {currentTrackerView === 'physical' && <PhysicalDetailsView />}
      {currentTrackerView === 'profile' && <ProfileView />}
      {currentTrackerView === 'about' && <AboutView />}

      {currentTrackerView === 'home' && (
        <>
          {/* Adaptive Routine Behaviour Banner (Requirement 6) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-300/70 rounded-3xl p-4 sm:p-5 shadow-sm transition-all relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-md">
                      Adaptive Routine Assistant
                    </span>
                    {adaptiveState === 'rescheduled' && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Routine adjusted ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                    {adaptiveState === 'prompt' && 'You missed your 5:00 PM Study Session.'}
                    {adaptiveState === 'rescheduled' && `Study Session rescheduled to ${rescheduledTime}.`}
                    {adaptiveState === 'skipped' && 'Study Session skipped for today.'}
                    {adaptiveState === 'moved' && 'Study Session moved to tomorrow.'}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {adaptiveState === 'prompt' && 'Would you like to adjust your routine?'}
                    {adaptiveState === 'rescheduled' && 'Your evening timeline has been automatically updated.'}
                    {adaptiveState === 'skipped' && 'Your streak is protected for today.'}
                    {adaptiveState === 'moved' && 'Reminders set for tomorrow 5:00 PM.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {adaptiveState === 'prompt' && (
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAdaptiveAction('reschedule')}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95"
                  >
                    Reschedule to 7:30 PM
                  </button>
                  <button
                    onClick={() => handleAdaptiveAction('skip')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    Skip Today
                  </button>
                  <button
                    onClick={() => handleAdaptiveAction('tomorrow')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    Move to Tomorrow
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid Row 1: Today's Progress Overview & Today's Routine Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Card A: Today's Progress Overview (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Today's Progress</h3>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {todayCompletionRate}% Completed
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* 2x2 Stats Grid (Requirements 3 & 13) */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                    {/* 1. Today's Progress */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {habitsCompletedTodayCount} / {totalActiveHabitsCount}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">Habits completed</p>
                      </div>
                    </div>

                    {/* 2. Current Streak */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                        <Flame className="w-4 h-4 fill-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">12 days</p>
                        <p className="text-[10px] text-slate-400 font-medium">Current streak</p>
                      </div>
                    </div>

                    {/* 3. Productivity Score */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 fill-purple-600 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{productivityScore}%</p>
                        <p className="text-[10px] text-slate-400 font-medium">Productivity</p>
                      </div>
                    </div>

                    {/* 4. Focus Time */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">3h 25m</p>
                        <p className="text-[10px] text-slate-400 font-medium">Focus time</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Concentric Progress Arcs Diagram */}
                  <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Outer base track */}
                      <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                      {/* Outer arc: Completion Rate */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#10B981"
                        strokeWidth="6"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * todayCompletionRate) / 100}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-500"
                      />

                      {/* Middle arc: Productivity */}
                      <circle cx="50" cy="50" r="32" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="32"
                        stroke="#8B5CF6"
                        strokeWidth="6"
                        strokeDasharray="201"
                        strokeDashoffset={201 - (201 * productivityScore) / 100}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-500"
                      />

                      {/* Inner arc: Streak */}
                      <circle cx="50" cy="50" r="22" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="22"
                        stroke="#F59E0B"
                        strokeWidth="6"
                        strokeDasharray="138"
                        strokeDashoffset="25"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-black text-slate-900">{todayCompletionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card B: Today's Routine Section (7 cols) (Requirement 4) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
              <div>
                {/* Header: Date & + Add Habit button */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Today's Routine
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      September 26, 2026 • Chronological schedule
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreateHabitOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1F2D27] hover:bg-[#16211C] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>+ Add Habit</span>
                  </button>
                </div>

                {/* Week Slider Strip */}
                <div className="flex items-center justify-between gap-1 py-1 px-1 border-b border-slate-100 pb-3">
                  <button className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-around flex-1 gap-1">
                    {weekDays.map((item) => {
                      const isSelected = item.date === selectedDayNumber;
                      return (
                        <button
                          key={item.date}
                          onClick={() => setSelectedDayNumber(item.date)}
                          className={`flex flex-col items-center py-1.5 px-2.5 rounded-2xl transition-all ${
                            isSelected
                              ? 'bg-[#10B981] text-white shadow-sm font-bold scale-105'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                            {item.day}
                          </span>
                          <span className="text-sm font-extrabold mt-0.5">{item.date}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Routine Habits Timeline Grouped by MORNING, AFTERNOON, EVENING */}
                <div className="space-y-4 mt-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                  {/* MORNING GROUP */}
                  {morningHabits.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-600 uppercase tracking-wider mb-2">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Morning Routine</span>
                      </div>
                      <div className="space-y-2">
                        {morningHabits.map((habit) => (
                          <div
                            key={habit.id}
                            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                              >
                                <DynamicIcon name={habit.icon} className="w-4 h-4" />
                              </div>

                              <div className="truncate">
                                <p
                                  className={`text-xs font-bold tracking-tight truncate ${
                                    habit.completedToday ? 'line-through text-slate-400' : 'text-slate-900'
                                  }`}
                                >
                                  {habit.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  {habit.reminderTime || '08:00 AM'} • {habit.target}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleHabitToday(habit.id)}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                                habit.completedToday
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>{habit.completedToday ? 'Done' : 'Complete'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AFTERNOON GROUP */}
                  {afternoonHabits.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 uppercase tracking-wider mb-2 pt-2 border-t border-slate-100">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Afternoon Focus</span>
                      </div>
                      <div className="space-y-2">
                        {afternoonHabits.map((habit) => (
                          <div
                            key={habit.id}
                            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                              >
                                <DynamicIcon name={habit.icon} className="w-4 h-4" />
                              </div>

                              <div className="truncate">
                                <p
                                  className={`text-xs font-bold tracking-tight truncate ${
                                    habit.completedToday ? 'line-through text-slate-400' : 'text-slate-900'
                                  }`}
                                >
                                  {habit.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  {habit.reminderTime || '14:00 PM'} • {habit.target}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleHabitToday(habit.id)}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                                habit.completedToday
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>{habit.completedToday ? 'Done' : 'Complete'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EVENING GROUP */}
                  {eveningHabits.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-purple-600 uppercase tracking-wider mb-2 pt-2 border-t border-slate-100">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Evening Wind-down</span>
                      </div>
                      <div className="space-y-2">
                        {eveningHabits.map((habit) => (
                          <div
                            key={habit.id}
                            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                              >
                                <DynamicIcon name={habit.icon} className="w-4 h-4" />
                              </div>

                              <div className="truncate">
                                <p
                                  className={`text-xs font-bold tracking-tight truncate ${
                                    habit.completedToday ? 'line-through text-slate-400' : 'text-slate-900'
                                  }`}
                                >
                                  {habit.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  {habit.reminderTime || '20:00 PM'} • {habit.target}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleHabitToday(habit.id)}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                                habit.completedToday
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>{habit.completedToday ? 'Done' : 'Complete'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 2: Repurposed Telemetry Cards (Current Streak & Productivity) (Requirement 13) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card A: Current Streak Card (repurposed from Heart Rate) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-semibold text-slate-500">Current Streak</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 my-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">12</span>
                  <span className="text-xs font-bold text-slate-400">Days</span>
                </div>

                {/* Streak Momentum Wave SVG */}
                <div className="w-32 h-10">
                  <svg className="w-full h-full" viewBox="0 0 120 40" fill="none">
                    <path
                      d="M0 25 Q15 10 30 25 T60 25 T90 10 T120 20"
                      stroke="#F97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Pill Footer */}
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-100">
                  <span>🔥</span>
                  <span>+2 days vs last week (Personal Best: 21d)</span>
                </span>
              </div>
            </div>

            {/* Card B: Productivity Score Card (repurposed from Cortisol) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600 fill-purple-600" />
                  <span className="text-xs font-semibold text-slate-500">Productivity Score</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 my-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{productivityScore}</span>
                  <span className="text-xs font-semibold text-slate-400">/100</span>
                </div>

                {/* Horizontal Color Meter Bar */}
                <div className="w-36 flex flex-col items-center">
                  <div className="w-full relative h-2">
                    <div
                      className="absolute -top-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-800 transition-all duration-300"
                      style={{ left: `${productivityScore}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                  <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-purple-600 shadow-inner" />
                </div>
              </div>

              {/* Pill Footer */}
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-900 border border-purple-100">
                  <span>⚡</span>
                  <span>High focus state maintained today</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section: Your Routine Insights (Requirement 11) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Your Routine Insights
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Behavioral Data
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-900">Morning Habit Adherence</p>
                <p className="text-sm font-black text-emerald-700 mt-1">87% Completed</p>
                <p className="text-[11px] text-emerald-800/80 mt-1 leading-snug">
                  You complete 87% of your morning habits before 10 AM.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                <p className="text-xs font-bold text-purple-900">Most Consistent Habit</p>
                <p className="text-sm font-black text-purple-700 mt-1">Meditation 🧘</p>
                <p className="text-[11px] text-purple-800/80 mt-1 leading-snug">
                  Your most consistent habit is Meditation (87% rate).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <p className="text-xs font-bold text-amber-900">Evening Shift Pattern</p>
                <p className="text-sm font-black text-amber-700 mt-1">Late Study Sessions</p>
                <p className="text-[11px] text-amber-800/80 mt-1 leading-snug">
                  You frequently postpone Study sessions scheduled after 8 PM.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100">
                <p className="text-xs font-bold text-orange-900">Current Streak Momentum</p>
                <p className="text-sm font-black text-orange-700 mt-1">12-Day Streak 🔥</p>
                <p className="text-[11px] text-orange-800/80 mt-1 leading-snug">
                  You're currently maintaining a 12-day streak across core routines.
                </p>
              </div>
            </div>
          </div>

          {/* Grid Row 3: Habit Streak Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Habit streak
                </h3>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                  <span>This month</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Segmented Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-full">
                <button
                  onClick={() => setStreakMode('monthly')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    streakMode === 'monthly'
                      ? 'bg-[#1C2833] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setStreakMode('yearly')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    streakMode === 'yearly'
                      ? 'bg-[#1C2833] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Horizontal Days Track */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 custom-scrollbar">
              {streakDays.map((item) => {
                const isDaySelected = selectedStreakDay === item.day;

                return (
                  <div
                    key={item.day}
                    onClick={() => setSelectedStreakDay(item.day)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer min-w-[28px]"
                  >
                    <div
                      className={`w-7 h-9 rounded-xl flex items-center justify-center transition-all ${
                        item.status === 'checked'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.status === 'active'
                          ? 'bg-[#10B981] text-white shadow-sm ring-2 ring-emerald-300'
                          : 'border border-slate-200/80 bg-slate-50/50 text-slate-300'
                      }`}
                    >
                      {item.status === 'checked' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {item.status === 'active' && (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white" />
                      )}
                      {item.status === 'future' && (
                        <div className="w-2.5 h-2.5 rounded-full border border-slate-300" />
                      )}
                    </div>

                    <span
                      className={`text-[11px] font-bold ${
                        isDaySelected ? 'text-slate-900 underline decoration-[#10B981] decoration-2' : 'text-slate-400'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid Row 4: Favourite Habit & Journaling Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6">
            {/* Card A: Favourite Habit (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Favourite habit
                </h3>
              </div>

              <div className="relative pt-12 pb-2">
                <div className="absolute top-10 inset-x-0 border-b border-dashed border-slate-200 pointer-events-none" />

                <div className="absolute top-0 left-[38%] -translate-x-1/2 bg-white rounded-2xl p-2.5 shadow-md border border-slate-100 z-10 text-left min-w-[120px] pointer-events-none animate-fade-in">
                  <p className="text-[10px] font-semibold text-slate-400">
                    {habitBars[selectedBar].name}
                  </p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {habitBars[selectedBar].time}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                    {habitBars[selectedBar].change}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3 h-32 px-2">
                  {habitBars.map((bar, idx) => {
                    const isMeditation = bar.name === 'Meditation';
                    const isSelected = selectedBar === idx;

                    return (
                      <div
                        key={bar.name}
                        onClick={() => setSelectedBar(idx)}
                        className="flex flex-col items-center gap-2 flex-1 cursor-pointer group"
                      >
                        <div
                          className={`w-full rounded-2xl transition-all duration-300 relative flex items-start justify-center pt-1.5 ${
                            isMeditation
                              ? 'bg-[#2E7D66] hover:bg-[#256854] shadow-sm'
                              : isSelected
                              ? 'bg-slate-300'
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}
                          style={{ height: `${bar.height}%` }}
                        >
                          {isMeditation && (
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                              <Sparkles className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-semibold truncate ${
                            isSelected || isMeditation ? 'text-slate-900 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {bar.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card B: Journaling Feature (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl p-6 border border-slate-200/60 shadow-2xs relative overflow-hidden bg-gradient-to-br from-[#F5F8F7] via-[#F4F7F6] to-[#EFF4F2] flex flex-col justify-between">
              <div className="absolute top-2 left-6 w-20 h-20 rounded-full bg-emerald-300/40 blur-2xl pointer-events-none" />
              <div className="absolute top-4 left-1/3 w-20 h-20 rounded-full bg-indigo-400/35 blur-2xl pointer-events-none" />
              <div className="absolute top-2 right-1/4 w-20 h-20 rounded-full bg-rose-400/40 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
                <div className="text-center sm:text-left flex-1">
                  <p className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-700 uppercase">
                    DAILY REFLECTION
                  </p>
                  <h4 className="font-cursive text-3xl sm:text-4xl text-slate-800 -mt-1 drop-shadow-xs">
                    Journaling
                  </h4>
                </div>

                <button
                  onClick={handleSaveJournal}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 border border-slate-200/60"
                >
                  <span>Log entry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              <div className="relative z-10 bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-white/80 shadow-2xs mt-2">
                <textarea
                  value={journalSummary}
                  onChange={(e) => setJournalSummary(e.target.value)}
                  placeholder="Write a summary of your day or key lessons..."
                  rows={2}
                  className="w-full bg-transparent resize-none outline-none text-xs text-slate-800 placeholder:text-slate-400 font-medium"
                />

                <div className="flex items-center justify-between pt-1 border-t border-slate-100/60 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {journalSummary.length > 0 ? `${journalSummary.length} characters` : 'Mindful reflection (+20 XP)'}
                  </span>
                  <button
                    onClick={handleSaveJournal}
                    className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition-colors"
                    title="Send / Log entry"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 5: Daily Wins & Habit Consistency Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6">
            <div className="lg:col-span-5">
              <DailyWinsCard />
            </div>
            <div className="lg:col-span-7">
              <HabitHeatmapCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

