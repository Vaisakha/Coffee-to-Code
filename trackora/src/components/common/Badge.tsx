import React from 'react';
import { HabitCategory, HabitDifficulty } from '../../types';

interface CategoryBadgeProps {
  category: HabitCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const styles: Record<HabitCategory, { label: string; bg: string; text: string; dot: string }> = {
    health: {
      label: 'Health',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    fitness: {
      label: 'Fitness',
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
      text: 'text-sky-700 dark:text-sky-300',
      dot: 'bg-sky-500',
    },
    mindfulness: {
      label: 'Mindfulness',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
      text: 'text-cyan-700 dark:text-cyan-300',
      dot: 'bg-cyan-500',
    },
    productivity: {
      label: 'Productivity',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    learning: {
      label: 'Learning',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60',
      text: 'text-purple-700 dark:text-purple-300',
      dot: 'bg-purple-500',
    },
    lifestyle: {
      label: 'Lifestyle',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
    },
  };

  const current = styles[category] || styles.lifestyle;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses} ${current.bg} ${current.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty?: HabitDifficulty }> = ({ difficulty = 'medium' }) => {
  const colors = {
    easy: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50',
    medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50',
    hard: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50',
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
};
