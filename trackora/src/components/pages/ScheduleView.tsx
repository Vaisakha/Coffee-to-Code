import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { CategoryBadge } from '../common/Badge';
import {
  CalendarDays,
  Plus,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Bell,
  Trash2
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const {
    schedule,
    toggleScheduleItem,
    deleteScheduleItem,
    setIsCreateScheduleOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [currentDayOffset, setCurrentDayOffset] = useState(0);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Schedule & Time Blocks
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Structure your hours with intentional focus blocks and habit integrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher: Day, Week, Month */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Month View
            </button>
          </div>

          <button
            onClick={() => setIsCreateScheduleOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* View Modes */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          {/* Day Navigation */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDayOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-bold text-slate-900 dark:text-white px-2">
                {currentDayOffset === 0 ? 'Today (Friday, Sep 25)' : `Day ${currentDayOffset > 0 ? `+${currentDayOffset}` : currentDayOffset}`}
              </h2>
              <button
                onClick={() => setCurrentDayOffset((prev) => prev + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              {schedule.filter((s) => s.completed).length}/{schedule.length} Time Blocks Completed
            </span>
          </div>

          {/* Time Blocks Visual Grid */}
          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  item.completed
                    ? 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200/50 dark:border-slate-800/40 opacity-70'
                    : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Start time pill */}
                  <div className="w-16 py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-center shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">
                      {item.time}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.durationMinutes}m
                    </span>
                  </div>

                  {/* Category icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <DynamicIcon name={item.icon || 'Clock'} className="w-5 h-5" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-bold truncate ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </p>
                      {item.reminderEnabled && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          <Bell className="w-3 h-3 text-slate-400" />
                          Remind
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <CategoryBadge category={item.category} size="sm" />

                  <button
                    onClick={() => toggleScheduleItem(item.id)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
                    }`}
                    aria-label={`Toggle ${item.name}`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <button
                    onClick={() => deleteScheduleItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Weekly Routine Blueprint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {day}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {idx === 4 ? 'Today' : idx < 4 ? 'Done' : 'Upcoming'}
                  </span>

                  <div className="mt-3 space-y-1.5">
                    {schedule.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="text-[11px] p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 truncate font-medium text-slate-700 dark:text-slate-300"
                      >
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 mr-1">
                          {item.time}
                        </span>
                        {item.name}
                      </div>
                    ))}
                    {schedule.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-semibold block text-center pt-1">
                        +{schedule.length - 3} more blocks
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {idx <= 4 ? '85% Target Met' : 'Planned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              September 2026 Overview
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              30-day consistency heatmap
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 25;
              const score = (dayNum * 7 + 60) % 35 + 65; // pseudo-realistic adherence

              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                      : 'border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{dayNum}</span>
                  <span
                    className={`text-[10px] font-bold mt-1 inline-block px-1 rounded ${
                      score >= 85
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : score >= 75
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {score}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
