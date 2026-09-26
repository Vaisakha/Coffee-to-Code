import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { Sparkles, Brain, Moon, CheckCircle2 } from 'lucide-react';

export const ProductivityScore: React.FC = () => {
  const { productivityScore, todayCompletionRate } = useApp();

  // Sub-scores derived realistically
  const habitSubScore = Math.min(100, Math.round(todayCompletionRate * 0.9 + 10));
  const focusSubScore = 92;
  const sleepSubScore = 85;
  const routineSubScore = Math.min(100, Math.round(productivityScore * 0.95 + 4));

  const breakdown = [
    { label: 'Habits', value: habitSubScore, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { label: 'Focus', value: focusSubScore, icon: Brain, color: 'text-amber-500', bg: 'bg-amber-500' },
    { label: 'Sleep', value: sleepSubScore, icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500' },
    { label: 'Routine', value: routineSubScore, icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Productivity Score
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Composite algorithmic metric of daily execution
        </p>
      </div>

      {/* Circular Ring Indicator */}
      <div className="py-4 flex flex-col items-center justify-center">
        <CircularProgress
          value={productivityScore}
          size={150}
          strokeWidth={13}
          gradientId="prodScoreGradient"
          startColor="#10b981"
          endColor="#06b6d4"
          label="Optimal"
          subLabel="Rank: Top 5%"
          valueSuffix=""
        />
      </div>

      {/* Sub-score breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {breakdown.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/60"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.bg}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
