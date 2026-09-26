import React, { useState } from 'react';
import { LeftWidgetsSidebar } from './LeftWidgetsSidebar';
import { DashboardMain } from './DashboardMain';
import { AskAIModal } from './AskAIModal';
import { AddWidgetModal } from './AddWidgetModal';
import { TrackerNotificationsDrawer } from './TrackerNotificationsDrawer';
import { TrackerChatModal } from './TrackerChatModal';
import { StreakFreezeModal } from './StreakFreezeModal';
import { LevelXPModal } from './LevelXPModal';
import { CreateHabitModal } from '../modals/CreateHabitModal';
import { ToastContainer } from '../common/ToastContainer';

export const TrackerLayout: React.FC = () => {
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isStreakFreezeOpen, setIsStreakFreezeOpen] = useState(false);
  const [isLevelXPOpen, setIsLevelXPOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Outer macOS Application Frame Window */}
      <div className="w-full max-w-[1440px] bg-[#FAFBFB] rounded-[28px] sm:rounded-[36px] shadow-2xl border border-slate-200/70 p-4 sm:p-6 lg:p-7 transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Consistency Widgets */}
          <LeftWidgetsSidebar onOpenAddWidget={() => setIsAddWidgetOpen(true)} />

          {/* Right Column: Dashboard Main Content */}
          <DashboardMain
            onOpenAskAI={() => setIsAskAIOpen(true)}
            onOpenAddTasks={() => setIsCreateTaskOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenStreakFreeze={() => setIsStreakFreezeOpen(true)}
            onOpenLevelXP={() => setIsLevelXPOpen(true)}
          />
        </div>
      </div>

      {/* Interactive Modals & Drawers */}
      <AskAIModal isOpen={isAskAIOpen} onClose={() => setIsAskAIOpen(false)} />
      <AddWidgetModal isOpen={isAddWidgetOpen} onClose={() => setIsAddWidgetOpen(false)} />
      <TrackerNotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <TrackerChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <StreakFreezeModal isOpen={isStreakFreezeOpen} onClose={() => setIsStreakFreezeOpen(false)} />
      <LevelXPModal isOpen={isLevelXPOpen} onClose={() => setIsLevelXPOpen(false)} />
      <CreateHabitModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};
