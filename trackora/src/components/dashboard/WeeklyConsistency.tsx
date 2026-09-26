import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, TrendingUp } from 'lucide-react';

export const WeeklyConsistency: React.FC = () => {
  const { analytics } = useApp();
  const [range, setRange] = useState<'7' | '30' | '90'>('7');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Slice data based on range
  const daysCount = parseInt(range);
  const data = analytics.slice(analytics.length - daysCount);

  const avgCompletion = Math.round(
    data.reduce((acc, curr) => acc + curr.completionRate, 0) / data.length
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Consistency Trends
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              {avgCompletion}% Avg
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Daily completion rate across all your tracked routines
          </p>
        </div>

        {/* Range Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setRange('7')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              range === '7'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setRange('30')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              range === '30'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setRange('90')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              range === '90'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="pt-2">
        {range === '7' ? (
          // Beautiful 7-Day Bar Display
          <div className="grid grid-cols-7 gap-2.5 sm:gap-4 h-48 items-end pb-2">
            {data.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              const isToday = idx === data.length - 1;

              return (
                <div
                  key={item.date}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 z-20 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap animate-fade-in pointer-events-none">
                      {item.dayName}, {item.date.split('-').slice(1).join('/')}: {item.completionRate}%
                    </div>
                  )}

                  {/* Percentage Top Text */}
                  <span
                    className={`text-[11px] font-bold mb-1.5 transition-colors ${
                      isToday
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.completionRate}%
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-xl h-36 flex flex-col justify-end p-1 transition-all group-hover:bg-slate-200/80 dark:group-hover:bg-slate-750">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ease-out ${
                        isToday
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/30'
                          : 'bg-emerald-500/80 group-hover:bg-emerald-500'
                      }`}
                      style={{ height: `${item.completionRate}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-xs mt-2 font-semibold ${
                      isToday
                        ? 'font-bold text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // Continuous Dense Sparkline Bar Chart for 30 / 90 Days
          <div className="h-48 flex items-end gap-1 sm:gap-1.5 pb-2 px-1">
            {data.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <div
                  key={item.date}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
                >
                  {isHovered && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap">
                      {item.date}: {item.completionRate}%
                    </div>
                  )}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-sm h-36 flex flex-col justify-end">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        item.completionRate >= 85
                          ? 'bg-emerald-500'
                          : item.completionRate >= 70
                          ? 'bg-teal-400'
                          : 'bg-amber-400'
                      } ${isHovered ? 'ring-2 ring-emerald-400' : ''}`}
                      style={{ height: `${item.completionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
