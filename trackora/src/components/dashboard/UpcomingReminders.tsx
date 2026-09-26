import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { DynamicIcon } from '../common/DynamicIcon';

export const UpcomingReminders: React.FC = () => {
  const { schedule, toggleScheduleItem, setActiveTab } = useApp();

  // Upcoming items that are not yet completed
  const upcoming = schedule.filter((s) => !s.completed).slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-emerald-500" />
            Upcoming Reminders
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Next scheduled blocks on today’s itinerary
          </p>
        </div>

        <button
          onClick={() => setActiveTab('schedule')}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center"
        >
          <span>Schedule</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reminder items */}
      <div className="space-y-2.5 my-2">
        {upcoming.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-500 mb-1" />
            All scheduled items for today have been completed!
          </div>
        ) : (
          upcoming.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/60 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold shrink-0">
                  {item.time}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    Duration: {item.durationMinutes} mins
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleScheduleItem(item.id)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition-colors shrink-0"
              >
                Mark Done
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Smart alerts enabled for desktop</span>
        <button
          onClick={() => setActiveTab('settings')}
          className="hover:underline font-medium text-emerald-600 dark:text-emerald-400"
        >
          Manage Notifications
        </button>
      </div>
    </div>
  );
};
