import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  CalendarDays,
  Target,
  BarChart3,
  Trophy,
  Sparkles,
  Settings,
  Plus,
  Flame,
  Moon,
  Sun,
  ChevronRight,
  Milestone,
  Lock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    habits,
    goals,
    suggestions,
    user,
    theme,
    toggleTheme,
    setIsCreateHabitOpen,
    readyToRevisitCount,
    resurfacedVaultCount,
  } = useApp();

  const activeHabitsCount = habits.filter((h) => !h.paused).length;
  const activeGoalsCount = goals.filter((g) => !g.completed).length;
  const pendingSuggestionsCount = suggestions.filter((s) => !s.applied && !s.dismissed).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: CalendarCheck },
    { id: 'habits', label: 'Habits', icon: CheckSquare, badge: activeHabitsCount },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'almost-list', label: 'Almost List', icon: Milestone, badge: readyToRevisitCount },
    { id: 'vault', label: 'Unsent Vault', icon: Lock, badge: resurfacedVaultCount },
    { id: 'goals', label: 'Goals', icon: Target, badge: activeGoalsCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'rewards', label: 'Rewards', icon: Trophy, badgeHighlight: `Lvl ${user.level}` },
    { id: 'ai-suggestions', label: 'AI Suggestions', icon: Sparkles, badge: pendingSuggestionsCount, isAI: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.xpToNextLevel) * 100));

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              HabitFlow
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              Build better days
            </p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsCreateHabitOpen(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-emerald-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200/60 dark:border-emerald-800/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      item.isAI
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 animate-pulse'
                        : isActive
                        ? 'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.badgeHighlight && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {item.badgeHighlight}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Gamification Level Mini Widget */}
      <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800/40 dark:to-emerald-950/20 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Level {user.level}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {user.currentXp}/{user.xpToNextLevel} XP
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* User Footer Profile & Theme Toggle */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity flex-1"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
          />
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
