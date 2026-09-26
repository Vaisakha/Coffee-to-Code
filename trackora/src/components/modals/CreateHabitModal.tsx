import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { HabitCategory, HabitFrequency, HabitDifficulty } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';

const ICON_OPTIONS = [
  'Droplets', 'Dumbbell', 'BookOpen', 'Sparkles', 'Brain', 'Moon',
  'Apple', 'PenTool', 'Sun', 'Clock', 'Coffee', 'Heart',
  'Target', 'Zap', 'Smile', 'Compass'
];

const COLOR_OPTIONS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Sky Blue', value: '#0284c7' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Lime', value: '#84cc16' },
];

export const CreateHabitModal: React.FC = () => {
  const {
    isCreateHabitOpen,
    setIsCreateHabitOpen,
    editingHabit,
    setEditingHabit,
    createHabit,
    updateHabit,
    goals,
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetValue, setTargetValue] = useState<number>(1);
  const [unit, setUnit] = useState('times');
  const [preferredTimeOfDay, setPreferredTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');
  const [reminderTime, setReminderTime] = useState('07:30');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');
  const [color, setColor] = useState('#10b981');
  const [icon, setIcon] = useState('Droplets');
  const [relatedGoalId, setRelatedGoalId] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description || '');
      setCategory(editingHabit.category);
      setFrequency(editingHabit.frequency);
      setTargetValue(editingHabit.targetValue);
      setUnit(editingHabit.unit);
      setPreferredTimeOfDay(editingHabit.preferredTimeOfDay);
      setReminderTime(editingHabit.reminderTime || '07:30');
      setDifficulty(editingHabit.difficulty);
      setColor(editingHabit.color);
      setIcon(editingHabit.icon);
      setRelatedGoalId(editingHabit.relatedGoalId || '');
    } else {
      setName('');
      setDescription('');
      setCategory('health');
      setFrequency('daily');
      setTargetValue(1);
      setUnit('times');
      setPreferredTimeOfDay('morning');
      setReminderTime('07:30');
      setDifficulty('medium');
      setColor('#10b981');
      setIcon('Droplets');
      setRelatedGoalId('');
    }
    setErrors({});
  }, [editingHabit, isCreateHabitOpen]);

  const handleClose = () => {
    setIsCreateHabitOpen(false);
    setEditingHabit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Habit name is required' });
      return;
    }

    const targetFormatted = `${targetValue} ${unit}`;

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: name.trim(),
        description: description.trim(),
        category,
        frequency,
        target: targetFormatted,
        targetValue,
        unit,
        preferredTimeOfDay,
        reminderTime,
        difficulty,
        color,
        icon,
        relatedGoalId: relatedGoalId || undefined,
      });
    } else {
      createHabit({
        name: name.trim(),
        description: description.trim(),
        category,
        frequency,
        target: targetFormatted,
        targetValue,
        unit,
        preferredTimeOfDay,
        reminderTime,
        difficulty,
        color,
        icon,
        relatedGoalId: relatedGoalId || undefined,
      });
    }

    handleClose();
  };

  return (
    <Modal
      isOpen={isCreateHabitOpen}
      onClose={handleClose}
      title={editingHabit ? 'Edit Habit' : 'Create New Habit'}
      subtitle={editingHabit ? 'Update habit parameters and reminders' : 'Define what you want to achieve consistently'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Habit Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            placeholder="e.g. Read 20 mins, Drink 2L Water, Morning Cardio"
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Why It Matters (Description)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Enhances cognitive stamina and focus for afternoon tasks"
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category & Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="productivity">Productivity / Study</option>
              <option value="learning">Learning</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="daily">Every day</option>
              <option value="weekdays">Weekdays (Mon - Fri)</option>
              <option value="weekends">Weekends (Sat - Sun)</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>
        </div>

        {/* Target Value & Unit */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Daily Target
            </label>
            <input
              type="number"
              min={1}
              value={targetValue}
              onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. mins, glasses, pages"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as HabitDifficulty)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="easy">Easy (+10 XP)</option>
              <option value="medium">Medium (+20 XP)</option>
              <option value="hard">Hard (+30 XP)</option>
            </select>
          </div>
        </div>

        {/* Preferred Time & Reminder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Time of Day
            </label>
            <select
              value={preferredTimeOfDay}
              onChange={(e) => setPreferredTimeOfDay(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="morning">Morning (06:00 - 12:00)</option>
              <option value="afternoon">Afternoon (12:00 - 17:00)</option>
              <option value="evening">Evening (17:00 - 23:00)</option>
              <option value="anytime">Anytime / All Day</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Reminder Time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Icon & Color Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Choose Icon
          </label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 custom-scrollbar">
            {ICON_OPTIONS.map((iconName) => (
              <button
                type="button"
                key={iconName}
                onClick={() => setIcon(iconName)}
                className={`p-2 rounded-lg transition-all ${
                  icon === iconName
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <DynamicIcon name={iconName} className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Color Accent
          </label>
          <div className="flex items-center gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-6 h-6 rounded-full transition-transform ${
                  color === c.value ? 'scale-125 ring-2 ring-slate-900 dark:ring-white ring-offset-2' : 'hover:scale-110'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Link to Goal */}
        {goals.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Link to Long-Term Goal (Optional)
            </label>
            <select
              value={relatedGoalId}
              onChange={(e) => setRelatedGoalId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">None (Standalone Habit)</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.progressPercentage}%)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/25 transition-all"
          >
            {editingHabit ? 'Save Changes' : 'Create Habit (+40 XP)'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
