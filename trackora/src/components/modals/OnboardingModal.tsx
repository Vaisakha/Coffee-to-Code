import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Check, Sparkles, Target, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'fitness', label: 'Fitness & Physical Health', icon: '💪' },
  { id: 'productivity', label: 'Deep Work & Productivity', icon: '⚡' },
  { id: 'mindfulness', label: 'Mental Calm & Mindfulness', icon: '🧘' },
  { id: 'reading', label: 'Continuous Reading & Growth', icon: '📚' },
  { id: 'sleep', label: 'Better Sleep Quality', icon: '🌙' },
  { id: 'hydration', label: 'Hydration & Nutrition', icon: '💧' },
];

const HABIT_PRESETS = [
  { name: 'Hydrate with 2.5L Water', category: 'health', icon: 'Droplets' },
  { name: 'Morning Cardio 30 mins', category: 'fitness', icon: 'Dumbbell' },
  { name: 'Read 20 pages of a book', category: 'learning', icon: 'BookOpen' },
  { name: '10-minute Breathwork', category: 'mindfulness', icon: 'Sparkles' },
  { name: 'Deep Work (90 min focus)', category: 'productivity', icon: 'Brain' },
  { name: 'No screens after 10:15 PM', category: 'health', icon: 'Moon' },
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, addToast, updateUserProfile } = useApp();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['fitness', 'reading', 'productivity']);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(['Hydrate with 2.5L Water', 'Morning Cardio 30 mins', 'Read 20 pages of a book']);
  const [startOfDay, setStartOfDay] = useState('06:30');
  const [bedtime, setBedtime] = useState('22:30');
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  if (!isOnboardingOpen) return null;

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleHabit = (name: string) => {
    setSelectedHabits((prev) =>
      prev.includes(name) ? prev.filter((h) => h !== name) : [...prev, name]
    );
  };

  const handleFinish = () => {
    updateUserProfile({
      startOfDay,
      smartReminders: remindersEnabled,
    });
    setIsOnboardingOpen(false);
    addToast('🎉 Welcome to HabitFlow!', 'Your personalized routine has been generated.');
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      title="Personalize Your HabitFlow"
      subtitle={`Step ${step} of 4: Setup your daily lifestyle routine`}
      maxWidth="max-w-xl"
    >
      <div className="py-2">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    step > s ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Goals */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What are your main focus areas?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select what you want to improve. We’ll tailor your recommendations accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOAL_OPTIONS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="text-xs font-semibold flex-1">{goal.label}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Starter Habits */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Choose your foundational habits
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Starting small with 2–4 high-impact habits yields the highest long-term consistency.
              </p>
            </div>

            <div className="space-y-2">
              {HABIT_PRESETS.map((preset) => {
                const isSelected = selectedHabits.includes(preset.name);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => toggleHabit(preset.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold">{preset.name}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {preset.category}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Timings */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Define your circadian routine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                HabitFlow adapts your reminders to naturally match your wake and rest windows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Wake Up Window</span>
                </div>
                <input
                  type="time"
                  value={startOfDay}
                  onChange={(e) => setStartOfDay(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Morning habits will start shortly after this time.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Bedtime Target</span>
                </div>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Evening wind-down routine will begin 45m prior.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Enable Smart Behavioral Reminders
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Notify you gently before scheduled time blocks to eliminate forgetfulness.
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Step 4: Summary & Generate */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Your Routine Blueprint is Ready!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                We’ve configured your daily timeline, habit streaks, and productivity score engine based on your inputs.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedHabits.length}
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Starter Habits</p>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedGoals.length}
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Focus Areas</p>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {startOfDay} - {bedtime}
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Active Window</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Skip setup
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/20"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/25"
            >
              Launch HabitFlow
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
