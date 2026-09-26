import React from 'react';
import { useApp } from '../../context/AppContext';
import { TodayRoutine } from '../dashboard/TodayRoutine';
import { HabitOverview } from '../dashboard/HabitOverview';
import { WeeklyConsistency } from '../dashboard/WeeklyConsistency';
import { ProductivityScore } from '../dashboard/ProductivityScore';
import { SmartInsights } from '../dashboard/SmartInsights';
import { StreaksSection } from '../dashboard/StreaksSection';
import { UpcomingReminders } from '../dashboard/UpcomingReminders';
import {
  Flame,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    todayCompletionRate,
    habitsCompletedTodayCount,
    totalActiveHabitsCount,
    longestStreak,
    activeStreaksCount,
    setIsCreateHabitOpen,
    setIsOnboardingOpen,
  } = useApp();

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const stats = [
    {
      label: "Today's Completion",
      value: `${todayCompletionRate}%`,
      sub: 'Of daily routine logged',
      icon: Percent,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
    },
    {
      label: 'Current Streak',
      value: `${longestStreak} Days`,
      sub: `${activeStreaksCount} active habits`,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      border: 'border-orange-200/60 dark:border-orange-800/40',
    },
    {
      label: 'Habits Completed',
      value: `${habitsCompletedTodayCount}/${totalActiveHabitsCount}`,
      sub: 'Habits check-in today',
      icon: CheckCircle2,
      color: 'text-sky-500',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200/60 dark:border-sky-800/40',
    },
    {
      label: 'Weekly Consistency',
      value: '84%',
      sub: '+8% vs previous week',
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200/60 dark:border-purple-800/40',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Greeting & Date Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5 sm:p-6 rounded-3xl border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
              L{user.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {greeting}, {user.name.split(' ')[0]} 👋
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {todayFormatted} • “{user.tagline}”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Customize Routine</span>
          </button>

          <button
            onClick={() => setIsCreateHabitOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* 2. Top Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${stat.border} shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  {stat.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Split Section: Today's Routine & Habit Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Today's Routine Timeline (5 cols) */}
        <div className="lg:col-span-5">
          <TodayRoutine />
        </div>

        {/* Habit Overview Grid (7 cols) */}
        <div className="lg:col-span-7">
          <HabitOverview />
        </div>
      </div>

      {/* 4. Secondary Row: Weekly Consistency & Productivity Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <WeeklyConsistency />
        </div>
        <div className="lg:col-span-4">
          <ProductivityScore />
        </div>
      </div>

      {/* 5. Tertiary Row: Smart Insights, Active Streaks, Upcoming Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2 lg:col-span-1">
          <SmartInsights />
        </div>
        <div>
          <StreaksSection />
        </div>
        <div>
          <UpcomingReminders />
        </div>
      </div>
    </div>
  );
};
