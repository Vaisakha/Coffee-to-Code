import React from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryBadge } from '../common/Badge';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Link,
  Award
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const {
    goals,
    habits,
    updateGoalProgress,
    deleteGoal,
    setIsCreateGoalOpen,
  } = useApp();

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Long-Term Goals & Milestones
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Anchor your daily habits to high-impact quarterly and annual milestones
          </p>
        </div>

        <button
          onClick={() => setIsCreateGoalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Active Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>In Progress</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {activeGoals.length}
          </span>
        </h2>

        {activeGoals.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Target className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No active goals right now
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Set an ambitious target like reading 12 books or completing 150 workouts.
            </p>
            <button
              onClick={() => setIsCreateGoalOpen(true)}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              + Create your first milestone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeGoals.map((goal) => {
              const connectedHabits = habits.filter((h) =>
                goal.relatedHabitIds.includes(h.id)
              );

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category and Deadline */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <CategoryBadge category={goal.category} size="sm" />
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Target: {goal.deadline}</span>
                      </div>
                    </div>

                    {/* Goal Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
                      {goal.title}
                    </h3>

                    {goal.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {goal.description}
                      </p>
                    )}

                    {/* Progress Bar & Value */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {goal.progressPercentage}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${goal.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Connected Supporting Habits */}
                    {connectedHabits.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Supporting Daily Habits:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {connectedHabits.map((h) => (
                            <span
                              key={h.id}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1"
                            >
                              <Link className="w-3 h-3 text-emerald-500" />
                              {h.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: +1 Progress & Delete */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.currentValue + 1)}
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-colors"
                      >
                        +1 {goal.unit}
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.currentValue + 5)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        +5
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete goal "${goal.title}"?`)) {
                          deleteGoal(goal.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Completed Milestones</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {completedGoals.length} Achieved
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Achieved {goal.targetValue} {goal.unit} (100%)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  Completed 🎉
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
