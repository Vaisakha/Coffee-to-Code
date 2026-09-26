import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Lightbulb, Zap } from 'lucide-react';

export const SmartInsights: React.FC = () => {
  const { setActiveTab } = useApp();

  const insights = [
    {
      id: 'ins-1',
      title: 'Highest Consistency: Reading',
      text: 'You have logged reading for 14 straight days with 88% overall adherence.',
      badge: 'Peak Habit',
      color: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 text-purple-950 dark:text-purple-200',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
    },
    {
      id: 'ins-2',
      title: 'Workout Ripple Effect (+23%)',
      text: 'You complete 23% more daily habits on days when your morning workout is logged.',
      badge: 'Correlation',
      color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    },
    {
      id: 'ins-3',
      title: 'Circadian Peak: 9:00 AM – 11:30 AM',
      text: 'Deep work sessions scheduled before noon experience zero reported interruptions.',
      badge: 'Focus Zone',
      color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    },
    {
      id: 'ins-4',
      title: 'Evening Wind-down Vulnerability',
      text: 'Bedtime prep was delayed 3 times this week. Consider moving wind-down 20 mins earlier.',
      badge: 'Action Item',
      color: 'border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Smart Behavioral Insights
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Data patterns detected from your recent routine logs
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ai-suggestions')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Smart Coach</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className={`p-3.5 rounded-xl border transition-all hover:shadow-xs ${ins.color}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${ins.badgeColor}`}>
                {ins.badge}
              </span>
              <Lightbulb className="w-3.5 h-3.5 opacity-60" />
            </div>
            <h3 className="text-xs font-bold leading-tight mb-1">
              {ins.title}
            </h3>
            <p className="text-xs opacity-85 leading-relaxed">
              {ins.text}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        * Insights are generated automatically from completion telemetry and intended as helpful productivity guidelines.
      </p>
    </div>
  );
};
