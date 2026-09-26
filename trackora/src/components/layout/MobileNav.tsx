import React, { useState } from 'react';
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
  MoreHorizontal,
  X,
  Milestone,
  Lock
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, suggestions, goals } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: CalendarCheck },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  const moreTabs = [
    { id: 'almost-list', label: 'Almost List', icon: Milestone, desc: 'Decisions consciously not taken' },
    { id: 'vault', label: 'Unsent Vault', icon: Lock, desc: 'Locked letters never sent' },
    { id: 'goals', label: 'Goals & Milestones', icon: Target, desc: 'Track long-term targets' },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, desc: 'Consistency & charts' },
    { id: 'rewards', label: 'Rewards & Badges', icon: Trophy, desc: 'XP, levels & achievements' },
    { id: 'ai-suggestions', label: 'AI Smart Coach', icon: Sparkles, desc: 'Adaptive routine insights' },
    { id: 'settings', label: 'Settings & Profile', icon: Settings, desc: 'Preferences & data' },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'more') {
      setIsMoreOpen(true);
    } else {
      setActiveTab(id);
      setIsMoreOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer for More Items */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                More Sections
              </h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-1">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.label}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-lg select-none">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id || (tab.id === 'more' && ['goals', 'analytics', 'rewards', 'ai-suggestions', 'settings', 'almost-list', 'vault'].includes(activeTab));

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isTabActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isTabActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className={`text-[10px] mt-0.5 font-semibold ${isTabActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
                {isTabActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-0" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
