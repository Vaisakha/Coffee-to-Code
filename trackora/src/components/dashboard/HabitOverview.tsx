import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { CategoryBadge } from '../common/Badge';
import { Check, Flame, Plus, ChevronRight } from 'lucide-react';

export const HabitOverview: React.FC = () => {
  const {
    habits,
    toggleHabitToday,
    setIsCreateHabitOpen,
    setActiveTab,
    searchQuery,
  } = useApp();

  const activeHabits = habits.filter((h) => !h.paused);
  const filteredHabits = activeHabits.filter((h) =>
    searchQuery ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  // Generate last 7 days keys
  const last7Days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Habit Overview
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Quick check-in and consistency pulses for today
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateHabitOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center"
          >
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredHabits.map((habit) => {
          const progressPercent = Math.min(
            100,
            Math.round((habit.currentValue / habit.targetValue) * 100)
          );

          return (
            <div
              key={habit.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                habit.completedToday
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 shadow-xs'
                  : 'bg-white dark:bg-slate-850/80 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              {/* Top Row: Icon, Title, Streak */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                  >
                    <DynamicIcon name={habit.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Target: {habit.target}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/40 shrink-0">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300">
                    {habit.currentStreak}d
                  </span>
                </div>
              </div>

              {/* Middle: Last 7 Days Mini Heatmap & Progress Bar */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">7-Day Consistency</span>
                  <div className="flex items-center gap-1">
                    {last7Days.map((dateKey) => {
                      const isDone = habit.history?.[dateKey] || (dateKey === last7Days[6] && habit.completedToday);
                      return (
                        <div
                          key={dateKey}
                          title={`${dateKey}: ${isDone ? 'Completed' : 'Missed'}`}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            isDone
                              ? 'bg-emerald-500'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: habit.color,
                    }}
                  />
                </div>
              </div>

              {/* Bottom: Quick Complete Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <CategoryBadge category={habit.category} size="sm" />

                <button
                  onClick={() => toggleHabitToday(habit.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    habit.completedToday
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[2.5] ${habit.completedToday ? 'text-white' : ''}`} />
                  <span>{habit.completedToday ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
