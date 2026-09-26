import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { HabitCategory } from '../../types';

export const CreateGoalModal: React.FC = () => {
  const { isCreateGoalOpen, setIsCreateGoalOpen, createGoal, habits } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState<number>(10);
  const [unit, setUnit] = useState('books');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [category, setCategory] = useState<HabitCategory>('learning');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleClose = () => {
    setIsCreateGoalOpen(false);
    setTitle('');
    setDescription('');
    setTargetValue(10);
    setUnit('books');
    setDeadline('2026-12-31');
    setSelectedHabits([]);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Goal title is required' });
      return;
    }

    createGoal({
      title: title.trim(),
      description: description.trim(),
      targetValue,
      currentValue: 0,
      unit: unit.trim() || 'units',
      deadline,
      category,
      relatedHabitIds: selectedHabits,
    });

    handleClose();
  };

  const toggleHabitSelection = (id: string) => {
    setSelectedHabits((prev) =>
      prev.includes(id) ? prev.filter((hId) => hId !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      isOpen={isCreateGoalOpen}
      onClose={handleClose}
      title="Create Long-Term Goal"
      subtitle="Define a measurable milestone and connect your daily habits"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Goal Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({});
            }}
            placeholder="e.g. Read 12 Books This Year, Exercise 150 Times"
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this goal important? What is your strategy?"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Value
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
              Metric / Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. books, workouts, hours"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="learning">Learning</option>
              <option value="fitness">Fitness</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="health">Health</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Link habits */}
        {habits.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Connect Supporting Habits
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 custom-scrollbar">
              {habits.map((h) => {
                const isSelected = selectedHabits.includes(h.id);
                return (
                  <button
                    type="button"
                    key={h.id}
                    onClick={() => toggleHabitSelection(h.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {h.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/25 transition-all"
          >
            Create Goal (+50 XP)
          </button>
        </div>
      </form>
    </Modal>
  );
};
