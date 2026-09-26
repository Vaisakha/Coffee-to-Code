import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HabitCategory, HabitFrequency } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { CategoryBadge, DifficultyBadge } from '../common/Badge';
import {
  Plus,
  Search,
  Filter,
  Flame,
  Check,
  MoreVertical,
  Pause,
  Play,
  Edit2,
  Trash2,
  Trophy,
  CheckSquare,
  Clock
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const {
    habits,
    toggleHabitToday,
    incrementHabitProgress,
    deleteHabit,
    togglePauseHabit,
    setIsCreateHabitOpen,
    setEditingHabit,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    const matchesSearch = searchQuery
      ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesFrequency = selectedFrequency === 'all' || h.frequency === selectedFrequency;
    return matchesSearch && matchesCategory && matchesFrequency;
  });

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'health', label: 'Health' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'learning', label: 'Learning' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ];

  const frequencies = [
    { id: 'all', label: 'All Frequencies' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekdays', label: 'Weekdays' },
    { id: 'weekends', label: 'Weekends' },
  ];

  // Last 7 days for the mini calendar
  const last7Days: string[] = [];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const handleEdit = (habit: typeof habits[0]) => {
    setEditingHabit(habit);
    setIsCreateHabitOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteHabit(id);
    }
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Habit Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Design, schedule, and maintain atomic habits that build your ideal routine
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setIsCreateHabitOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Habit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter habits by name or description..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Frequency Dropdown */}
          <select
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {frequencies.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Habit Cards Grid */}
      {filteredHabits.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CheckSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No habits match your filters
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search criteria or create a brand new habit to track.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedFrequency('all');
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit) => {
            const isMenuOpen = activeMenuId === habit.id;
            const progressPercent = Math.min(
              100,
              Math.round((habit.currentValue / habit.targetValue) * 100)
            );

            return (
              <div
                key={habit.id}
                className={`relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  habit.paused
                    ? 'bg-slate-50/60 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                    : habit.completedToday
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Section */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                      >
                        <DynamicIcon name={habit.icon} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {habit.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <CategoryBadge category={habit.category} size="sm" />
                          <DifficultyBadge difficulty={habit.difficulty} />
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : habit.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Habit Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 animate-scale-in text-xs font-semibold">
                          <button
                            onClick={() => handleEdit(habit)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Habit</span>
                          </button>
                          <button
                            onClick={() => {
                              togglePauseHabit(habit.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
                          >
                            {habit.paused ? (
                              <>
                                <Play className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Resume</span>
                              </>
                            ) : (
                              <>
                                <Pause className="w-3.5 h-3.5 text-amber-500" />
                                <span>Pause</span>
                              </>
                            )}
                          </button>
                          <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                          <button
                            onClick={() => handleDelete(habit.id, habit.name)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {habit.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {habit.description}
                    </p>
                  )}

                  {/* Target and Time Details */}
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {habit.reminderTime || 'Anytime'} ({habit.frequency})
                    </span>
                    <span>Target: {habit.target}</span>
                  </div>

                  {/* Streak & Completion Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-center mb-3">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-xs">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        {habit.currentStreak}d
                      </div>
                      <span className="text-[10px] text-slate-400">Current</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        <Trophy className="w-3 h-3" />
                        {habit.bestStreak}d
                      </div>
                      <span className="text-[10px] text-slate-400">Best</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {habit.completionRate}%
                      </div>
                      <span className="text-[10px] text-slate-400">Rate</span>
                    </div>
                  </div>

                  {/* 7-Day Mini Heatmap */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Recent 7 Days</span>
                      <span>Weekly adherence</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {last7Days.map((dKey, idx) => {
                        const isDone = habit.history?.[dKey] || (idx === 6 && habit.completedToday);
                        return (
                          <div
                            key={dKey}
                            title={`${dKey}: ${isDone ? 'Completed' : 'Missed'}`}
                            className={`h-5 rounded-md flex items-center justify-center text-[9px] font-bold transition-colors ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            {dayLabels[idx]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Complete Button & Target Progress */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {habit.targetValue > 1 ? (
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => incrementHabitProgress(habit.id, 1)}
                        className="px-2 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                      >
                        +1 {habit.unit}
                      </button>
                      <span className="text-xs text-slate-500 font-medium">
                        {habit.currentValue}/{habit.targetValue} {habit.unit}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">
                      {habit.completedToday ? 'Goal Achieved' : 'Daily Goal'}
                    </span>
                  )}

                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      habit.completedToday
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{habit.completedToday ? 'Done' : 'Complete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
