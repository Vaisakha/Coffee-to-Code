import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Flame,
  Award,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Milestone,
  Lock,
  HeartHandshake,
  PieChart,
  Sparkles
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { habits, analytics, user, longestStreak, almostList, unsentDrafts, setActiveTab } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Filter analytics data based on selected period
  const dataLength = filterPeriod === 'week' ? 7 : filterPeriod === 'month' ? 30 : 90;
  // If we have 30, for 90 we can project smoothly
  const displayData = analytics.slice(analytics.length - Math.min(analytics.length, dataLength));

  // Almost List Patterns
  let reliefCount = 0;
  let regretCount = 0;
  let totalAlmostReflections = 0;
  almostList.forEach((item) => {
    if (item.reflections.length > 0) {
      totalAlmostReflections++;
      const last = item.reflections[item.reflections.length - 1];
      if (last.feeling === 'still_relieved') reliefCount++;
      else if (last.feeling === 'now_regret_it') regretCount++;
    }
  });
  const reliefPct = totalAlmostReflections > 0 ? Math.round((reliefCount / totalAlmostReflections) * 100) : 0;
  const regretPct = totalAlmostReflections > 0 ? Math.round((regretCount / totalAlmostReflections) * 100) : 0;

  // Vault Patterns
  let totalMonthsDiff = 0;
  unsentDrafts.forEach((d) => {
    const created = new Date(d.createdAt).getTime();
    const resurface = new Date(d.resurfacingDate).getTime();
    const diffDays = Math.max(1, (resurface - created) / (1000 * 60 * 60 * 24));
    totalMonthsDiff += diffDays / 30.4;
  });
  const avgMonthsToResurface = unsentDrafts.length > 0 ? parseFloat((totalMonthsDiff / unsentDrafts.length).toFixed(1)) : 0;

  const totalCompleted = user.totalHabitsCompleted;
  const avgCompletionRate = Math.round(
    displayData.reduce((acc, d) => acc + d.completionRate, 0) / (displayData.length || 1)
  );

  // Best performing habits
  const sortedHabits = [...habits].sort((a, b) => b.completionRate - a.completionRate);
  const bestHabit = sortedHabits[0];

  // Category performance
  const categoriesList = ['health', 'fitness', 'mindfulness', 'productivity', 'learning', 'lifestyle'] as const;
  const categoryStats = categoriesList.map((cat) => {
    const catHabits = habits.filter((h) => h.category === cat);
    const avgRate = catHabits.length > 0
      ? Math.round(catHabits.reduce((acc, h) => acc + h.completionRate, 0) / catHabits.length)
      : 80;
    return {
      category: cat,
      count: catHabits.length,
      rate: avgRate,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Productivity & Streak Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive behavioral telemetry, completion trends, and consistency insights
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'week'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'month'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setFilterPeriod('quarter')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'quarter'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Last 3 Months
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards (Requirement 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Weekly Completion</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            84%
          </p>
          <span className="text-[10px] text-emerald-500 font-bold">+8% vs previous week</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Habits Completed</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            42
          </p>
          <span className="text-[10px] text-slate-400 font-medium">This week</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Current Streak</span>
          <p className="text-2xl font-black text-orange-500 mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-orange-500" />
            12 days
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Active momentum</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Best Streak</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            21 days
          </p>
          <span className="text-[10px] text-purple-500 font-bold">Personal record</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Focus Time</span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            8h 25m
          </p>
          <span className="text-[10px] text-teal-500 font-bold">Deep work sessions</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit Completion Line & Bar Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Completion & Productivity Trajectory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite trend curve over {displayData.length} recorded days
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.4% Momentum
            </span>
          </div>

          {/* SVG Multi-layer Trend Visualization */}
          <div className="h-64 flex flex-col justify-end pt-4">
            <div className="flex-1 flex items-end gap-1.5 sm:gap-2 px-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              {displayData.map((d, i) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap transition-opacity pointer-events-none">
                    {d.dayName}: {d.completionRate}%
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500/80 to-teal-400 rounded-t-md transition-all duration-300 group-hover:from-emerald-500 group-hover:to-teal-300"
                    style={{ height: `${d.completionRate}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-2 px-2 font-medium">
              <span>{displayData[0]?.date}</span>
              <span>Mid Period</span>
              <span>{displayData[displayData.length - 1]?.date} (Today)</span>
            </div>
          </div>
        </div>

        {/* Category Performance (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Performance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adherence distribution by life pillar
            </p>
          </div>

          <div className="space-y-3.5 my-4">
            {categoryStats.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                    {item.category} ({item.count} habits)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.rate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            Health & Learning show your strongest neuro-pathway adherence.
          </p>
        </div>
      </div>

      {/* Secondary Row: Best Performing Habits & Missed Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Habits */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Top Performing Habits</span>
          </h2>

          <div className="space-y-3">
            {sortedHabits.slice(0, 4).map((h, idx) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-xs text-slate-400">
                    #{idx + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${h.color}15`, color: h.color }}
                  >
                    <DynamicIcon name={h.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {h.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Streak: {h.currentStreak} days • Best: {h.bestStreak} days
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {h.completionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Habit Patterns */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>Missed Habit Diagnostic Patterns</span>
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 mb-1">
                Evening Screen Curfew Skips (Past 10:15 PM)
              </h4>
              <p className="text-xs text-rose-800/80 dark:text-rose-300 leading-relaxed">
                Missed 4 times over the last 14 days, primarily on Thursday evenings when working late.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                Weekend Meditation Variance
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300 leading-relaxed">
                Saturday wake-up times fluctuate by 90 minutes, delaying morning mindfulness sessions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
              <h4 className="text-xs font-bold text-sky-900 dark:text-sky-200 mb-1">
                Mid-day Hydration Dip
              </h4>
              <p className="text-xs text-sky-800/80 dark:text-sky-300 leading-relaxed">
                Water intake slows down significantly between 2 PM and 4 PM during meetings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reflective & Decision Patterns (Almost List & Vault) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Reflective Patterns & Decision Health
              </h3>
              <p className="text-xs text-slate-400">
                Emotional outcomes from paths not taken and letters sealed in stillness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('almost-list')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Almost List</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('vault')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Almost List Pattern Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Milestone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Almost List Relief vs. Regret</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                {totalAlmostReflections} revisited
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Still Relieved:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {totalAlmostReflections > 0 ? `${reliefPct}%` : '—'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${reliefPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 dark:text-slate-400">Now Regret It:</span>
                <span className="font-extrabold text-rose-500">
                  {totalAlmostReflections > 0 ? `${regretPct}%` : '—'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${regretPct}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              Conscious boundary decisions show a strong bias towards enduring peace over second-guessing.
            </p>
          </div>

          {/* Vault Pattern Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Vault Resurfacing Dynamics</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                {unsentDrafts.length} letters sealed
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Average Time-to-Resurface
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {avgMonthsToResurface > 0 ? `${avgMonthsToResurface} Months` : '—'}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              Hidden intervals ensure that drafts surface only when emotional detachment allows honest introspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
