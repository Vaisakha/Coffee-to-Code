import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Check,
  X,
  Lightbulb,
  Clock,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert
} from 'lucide-react';
import { CategoryBadge } from '../common/Badge';

export const AISuggestionsView: React.FC = () => {
  const { suggestions, applySuggestion, dismissSuggestion, habits } = useApp();

  const activeSuggestions = suggestions.filter((s) => !s.applied && !s.dismissed);
  const appliedSuggestions = suggestions.filter((s) => s.applied);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-500/10 via-emerald-500/10 to-teal-500/5 p-6 rounded-3xl border border-purple-500/20 dark:border-purple-500/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Smart Coach & Adaptive Routines
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Intelligent recommendations derived from your routine patterns to minimize habit friction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
            {activeSuggestions.length} Pending Insights
          </span>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>How Smart Coach Works:</strong> Our adaptive engine checks completion timing, skip clusters, and cognitive load distribution from your logs. All suggestions are recommendations to improve your consistency and can be accepted or dismissed at any time.
        </p>
      </div>

      {/* Active Recommendations */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Active Recommendations</span>
        </h2>

        {activeSuggestions.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              You’re all caught up with Smart Coach!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Your routines are balanced and optimized. As you log more days, new adaptive adjustments will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeSuggestions.map((sug) => {
              const targetHabit = habits.find((h) => h.id === sug.targetHabitId);

              return (
                <div
                  key={sug.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category and Impact Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <CategoryBadge category={sug.category} size="sm" />
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {sug.impact} Impact
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                      {sug.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {sug.description}
                    </p>

                    {/* Telemetry Rationale Card */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Behavioral Evidence:
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-snug">
                        "{sug.rationale}"
                      </p>
                    </div>

                    {targetHabit && (
                      <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Affects: <strong>{targetHabit.name}</strong></span>
                        {sug.suggestedTime && (
                          <span>→ Change time to <strong>{sug.suggestedTime}</strong></span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => dismissSuggestion(sug.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>

                    <button
                      onClick={() => applySuggestion(sug.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Apply Suggestion (+30 XP)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applied Suggestions History */}
      {appliedSuggestions.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Recently Implemented Routine Adjustments
          </h2>
          <div className="space-y-2">
            {appliedSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-emerald-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sug.title}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Applied to Schedule
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
