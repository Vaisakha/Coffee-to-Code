import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { CategoryBadge } from '../common/Badge';
import {
  Sun,
  Sunset,
  Moon,
  Plus,
  Check,
  Bell,
  Clock,
  CalendarCheck2,
  Sparkles
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    schedule,
    toggleScheduleItem,
    setIsCreateScheduleOpen,
    todayCompletionRate,
    productivityScore,
  } = useApp();

  const morningBlocks = schedule.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonBlocks = schedule.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningBlocks = schedule.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  const completedCount = schedule.filter((s) => s.completed).length;

  const renderBlockSection = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    blocks: typeof schedule,
    accentColor: string
  ) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${accentColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {subtitle} • {blocks.filter((b) => b.completed).length}/{blocks.length} completed
            </p>
          </div>
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 text-center italic">
          No scheduled routine blocks for this window.
        </p>
      ) : (
        <div className="space-y-2.5">
          {blocks.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200/50 dark:border-slate-800/40 opacity-70'
                  : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 w-12 shrink-0">
                  {item.time}
                </span>

                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <DynamicIcon name={item.icon || 'Clock'} className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-bold truncate ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.name}
                    </p>
                    {item.reminderEnabled && (
                      <Bell className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.durationMinutes}m {item.notes ? `• ${item.notes}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                <CategoryBadge category={item.category} size="sm" />
                <button
                  onClick={() => toggleScheduleItem(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
                  }`}
                  aria-label={`Toggle ${item.name}`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Today’s Daily Flow
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {completedCount} of {schedule.length} routine activities completed ({todayCompletionRate}%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Productivity Index
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {productivityScore}/100
            </span>
          </div>

          <button
            onClick={() => setIsCreateScheduleOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Activity</span>
          </button>
        </div>
      </div>

      {/* Routine Sections Grouped by Time of Day */}
      <div className="space-y-5">
        {renderBlockSection(
          'Morning Routine (06:00 – 12:00)',
          'High energy and biological priming',
          <Sun className="w-4 h-4 text-amber-500" />,
          morningBlocks,
          'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
        )}

        {renderBlockSection(
          'Afternoon Focus (12:00 – 17:00)',
          'Sustained execution and healthy nutrition',
          <Sunset className="w-4 h-4 text-orange-500" />,
          afternoonBlocks,
          'bg-orange-50 dark:bg-orange-950/40 text-orange-600'
        )}

        {renderBlockSection(
          'Evening Wind-down (17:00 – 23:00)',
          'Restoration, reflection, and sleep prep',
          <Moon className="w-4 h-4 text-indigo-500" />,
          eveningBlocks,
          'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
        )}
      </div>
    </div>
  );
};
