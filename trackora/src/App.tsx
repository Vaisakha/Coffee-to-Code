import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TrackerLayout } from './components/tracker/TrackerLayout';

// Legacy Views in case Elena wants to view Goals, Analytics, Rewards
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/pages/DashboardView';
import { TodayView } from './components/pages/TodayView';
import { HabitsView } from './components/pages/HabitsView';
import { ScheduleView } from './components/pages/ScheduleView';
import { GoalsView } from './components/pages/GoalsView';
import { AnalyticsView } from './components/pages/AnalyticsView';
import { RewardsView } from './components/pages/RewardsView';
import { AISuggestionsView } from './components/pages/AISuggestionsView';
import { SettingsView } from './components/pages/SettingsView';
import { AlmostListView } from './components/pages/AlmostListView';
import { VaultView } from './components/pages/VaultView';

// Modals & Feedback
import { CreateHabitModal } from './components/modals/CreateHabitModal';
import { CreateGoalModal } from './components/modals/CreateGoalModal';
import { CreateScheduleModal } from './components/modals/CreateScheduleModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { ToastContainer } from './components/common/ToastContainer';
import { LayoutGrid, Layers } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  // 'widget-ui' corresponds to the exact UI from the user's attached screenshot
  const [viewMode, setViewMode] = useState<'widget-ui' | 'extended'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      if (['almost-list', 'vault', 'habits', 'schedule', 'goals', 'analytics', 'rewards', 'ai-suggestions', 'settings'].includes(path)) {
        return 'extended';
      }
    }
    return 'widget-ui';
  });

  // Automatically switch to extended management view when navigating to dedicated modules
  React.useEffect(() => {
    if (activeTab === 'almost-list' || activeTab === 'vault') {
      setViewMode('extended');
    }
  }, [activeTab]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'today':
        return <TodayView />;
      case 'habits':
        return <HabitsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'almost-list':
        return <AlmostListView />;
      case 'vault':
        return <VaultView />;
      case 'goals':
        return <GoalsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'rewards':
        return <RewardsView />;
      case 'ai-suggestions':
        return <AISuggestionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (viewMode === 'widget-ui') {
    return (
      <div className="relative">
        <TrackerLayout />

        {/* Floating switch to toggle extended navigation if needed */}
        <div className="fixed bottom-3 right-3 z-40">
          <button
            onClick={() => setViewMode('extended')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 text-[11px] font-bold shadow-md border border-slate-200 backdrop-blur-sm transition-all hover:scale-105 opacity-70 hover:opacity-100"
            title="Toggle Full Management View"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Classic Explorer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200 relative">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile / Tablet Bottom Navigation */}
        <MobileNav />
      </div>

      {/* Floating return to Widget UI button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setViewMode('widget-ui')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105"
        >
          <LayoutGrid className="w-4 h-4 text-emerald-400" />
          <span>Switch to Modern UI</span>
        </button>
      </div>

      {/* Modals & Dialogs */}
      <CreateHabitModal />
      <CreateGoalModal />
      <CreateScheduleModal />
      <OnboardingModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
