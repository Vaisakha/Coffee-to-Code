import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { HabitCategory } from '../../types';

export const CreateScheduleModal: React.FC = () => {
  const { isCreateScheduleOpen, setIsCreateScheduleOpen, createScheduleItem, habits } = useApp();

  const [name, setName] = useState('');
  const [time, setTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [category, setCategory] = useState<HabitCategory>('productivity');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [habitId, setHabitId] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleClose = () => {
    setIsCreateScheduleOpen(false);
    setName('');
    setTime('09:00');
    setDurationMinutes(45);
    setCategory('productivity');
    setReminderEnabled(true);
    setHabitId('');
    setNotes('');
    setErrors({});
  };

  const handleHabitSelect = (selectedId: string) => {
    setHabitId(selectedId);
    const found = habits.find((h) => h.id === selectedId);
    if (found) {
      setName(found.name);
      setCategory(found.category);
      if (found.reminderTime) setTime(found.reminderTime);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Activity name is required' });
      return;
    }

    createScheduleItem({
      name: name.trim(),
      time,
      durationMinutes,
      category,
      reminderEnabled,
      habitId: habitId || undefined,
      notes: notes.trim(),
    });

    handleClose();
  };

  return (
    <Modal
      isOpen={isCreateScheduleOpen}
      onClose={handleClose}
      title="Add Routine Schedule Item"
      subtitle="Schedule a specific activity or link an existing habit to a time block"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick link existing habit */}
        {habits.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Select Habit to Schedule (Optional)
            </label>
            <select
              value={habitId}
              onChange={(e) => handleHabitSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Custom Activity (Not a habit)</option>
              {habits.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.target})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Activity Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            placeholder="e.g. Deep Work Session, Team Standup, Outdoor Run"
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
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
              <option value="productivity">Productivity</option>
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="learning">Learning</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Enable Reminder
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Bring water bottle, prepare slides"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

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
            Add to Schedule
          </button>
        </div>
      </form>
    </Modal>
  );
};
