import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { CategoryBadge } from '../common/Badge';
import { Bell, Check, Clock, Plus, ChevronRight } from 'lucide-react';

export const TodayRoutine: React.FC = () => {
  const {
    schedule,
    toggleScheduleItem,
    setIsCreateScheduleOpen,
    setActiveTab,
    searchQuery,
  } = useApp();

  const filteredSchedule = schedule.filter((item) =>
    searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const completedCount = schedule.filter((s) => s.completed).length;
  const progressPct = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Today’s Routine
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {completedCount}/{schedule.length} Done ({progressPct}%)
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Your structured timeline of intentional daily blocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateScheduleOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Routine Timeline */}
      {filteredSchedule.length === 0 ? (
        <div className="py-8 text-center">
          <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No activities scheduled for this view.
          </p>
          <button
            onClick={() => setIsCreateScheduleOpen(true)}
            className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
          >
            + Add your first schedule block
          </button>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredSchedule.map((item) => (
            <div
              key={item.id}
              className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-slate-50/70 dark:bg-slate-850/40 border-slate-200/50 dark:border-slate-800/40 opacity-75'
                  : 'bg-white dark:bg-slate-850/90 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-sm'
              }`}
            >
              {/* Timeline Dot Marker */}
              <div
                className={`absolute -left-[27px] w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  item.completed
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-emerald-500'
                }`}
              />

              {/* Main Content */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Time & Duration */}
                <div className="w-16 shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-white block font-mono">
                    {item.time}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.durationMinutes} mins
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                >
                  <DynamicIcon name={item.icon || 'Clock'} className="w-4 h-4" />
                </div>

                {/* Title & Notes */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-bold truncate ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {item.name}
                    </p>
                    {item.reminderEnabled && (
                      <Bell className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="hidden sm:block shrink-0">
                  <CategoryBadge category={item.category} size="sm" />
                </div>
              </div>

              {/* Completion Action */}
              <div className="ml-3 shrink-0">
                <button
                  onClick={() => toggleScheduleItem(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    item.completed
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent hover:text-emerald-500/40'
                  }`}
                  aria-label={`Mark ${item.name} as ${item.completed ? 'incomplete' : 'complete'}`}
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
};
