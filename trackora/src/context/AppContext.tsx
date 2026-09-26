import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Habit,
  ScheduleItem,
  Goal,
  NotificationItem,
  Achievement,
  UserProfile,
  SmartSuggestion,
  DayAnalytics,
  DailyWin,
  HabitCategory,
  PhysicalDetails,
  CalorieMeterData,
  CalorieMealItem,
  AlmostListItem,
  AlmostListCategory,
  AlmostListFeeling,
  FeelingReflection,
  UnsentDraft,
  VaultRecipientType,
  VaultFeelingResponse,
  VaultReflection
} from '../types';
import {
  INITIAL_USER,
  INITIAL_HABITS,
  INITIAL_SCHEDULE,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SUGGESTIONS,
  INITIAL_ANALYTICS,
  INITIAL_DAILY_WINS,
  INITIAL_PHYSICAL_DETAILS,
  INITIAL_CALORIE_DATA,
  INITIAL_ALMOST_LIST,
  INITIAL_UNSENT_DRAFTS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'achievement' | 'fire';
}

interface AppContextType {
  user: UserProfile;
  habits: Habit[];
  schedule: ScheduleItem[];
  goals: Goal[];
  notifications: NotificationItem[];
  achievements: Achievement[];
  suggestions: SmartSuggestion[];
  analytics: DayAnalytics[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Modals state
  isCreateHabitOpen: boolean;
  setIsCreateHabitOpen: (open: boolean) => void;
  isCreateGoalOpen: boolean;
  setIsCreateGoalOpen: (open: boolean) => void;
  isCreateScheduleOpen: boolean;
  setIsCreateScheduleOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  editingHabit: Habit | null;
  setEditingHabit: (habit: Habit | null) => void;

  // Actions
  toggleHabitToday: (habitId: string) => void;
  incrementHabitProgress: (habitId: string, amount?: number) => void;
  createHabit: (habitData: Partial<Habit>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  togglePauseHabit: (id: string) => void;
  rescheduleHabit: (habitId: string, newTime: string) => void;
  
  toggleScheduleItem: (id: string) => void;
  createScheduleItem: (item: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  
  createGoal: (goal: Partial<Goal>) => void;
  updateGoalProgress: (id: string, newValue: number) => void;
  deleteGoal: (id: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  applySuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  
  // Daily Wins & Gamification
  dailyWins: DailyWin[];
  addDailyWin: (title: string, category?: HabitCategory | 'streak' | 'personal', xp?: number, icon?: string) => void;
  removeDailyWin: (id: string) => void;
  toggleStreakFreezeToday: () => void;
  buyStreakFreeze: () => void;
  awardXp: (amount: number, reason: string) => void;

  // Physical Details & Biometrics
  physicalDetails: PhysicalDetails;
  updatePhysicalDetails: (details: Partial<PhysicalDetails>) => void;

  // Calorie Meter & Nutrition
  calorieData: CalorieMeterData;
  addCalorieMeal: (meal: Omit<CalorieMealItem, 'id'>) => void;
  removeCalorieMeal: (id: string) => void;
  updateCalorieTargets: (targets: Partial<CalorieMeterData>) => void;

  // Modern Tracker Navigation View
  currentTrackerView: 'home' | 'calories' | 'physical' | 'profile' | 'about';
  setCurrentTrackerView: (view: 'home' | 'calories' | 'physical' | 'profile' | 'about') => void;

  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetDemoData: () => void;
  exportDataJson: () => void;

  // Almost List Module
  almostList: AlmostListItem[];
  createAlmostListItem: (item: {
    title: string;
    shortDescription: string;
    category: AlmostListCategory;
    dateLogged?: string;
    revisitDate?: string;
  }) => void;
  addAlmostListReflection: (itemId: string, feeling: AlmostListFeeling, note?: string) => void;
  deleteAlmostListItem: (id: string) => void;
  triggerTestRevisit: (itemId: string) => void;
  readyToRevisitCount: number;

  // Unsent Drafts Vault Module
  unsentDrafts: UnsentDraft[];
  createUnsentDraft: (draft: {
    recipient: string;
    recipientType: VaultRecipientType;
    title: string;
    content: string;
  }) => void;
  addVaultReflection: (draftId: string, response: VaultFeelingResponse) => void;
  deleteUnsentDraft: (id: string) => void;
  triggerTestResurface: (draftId: string) => void;
  resurfacedVaultCount: number;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Computed helpers
  todayCompletionRate: number;
  habitsCompletedTodayCount: number;
  totalActiveHabitsCount: number;
  activeStreaksCount: number;
  longestStreak: number;
  productivityScore: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'habitflow_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with mock defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}habits`);
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}schedule`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}goals`);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}achievements`);
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}suggestions`);
    return saved ? JSON.parse(saved) : INITIAL_SUGGESTIONS;
  });

  const [dailyWins, setDailyWins] = useState<DailyWin[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}daily_wins`);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_WINS;
  });

  const [physicalDetails, setPhysicalDetails] = useState<PhysicalDetails>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}physical_details`);
    return saved ? JSON.parse(saved) : INITIAL_PHYSICAL_DETAILS;
  });

  const [calorieData, setCalorieData] = useState<CalorieMeterData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}calorie_data`);
    return saved ? JSON.parse(saved) : INITIAL_CALORIE_DATA;
  });

  const [currentTrackerView, setCurrentTrackerView] = useState<'home' | 'calories' | 'physical' | 'profile' | 'about'>('home');

  const [analytics] = useState<DayAnalytics[]>(INITIAL_ANALYTICS);

  const [almostList, setAlmostList] = useState<AlmostListItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}almost_list`);
    return saved ? JSON.parse(saved) : INITIAL_ALMOST_LIST;
  });

  const [unsentDrafts, setUnsentDrafts] = useState<UnsentDraft[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}unsent_drafts`);
    return saved ? JSON.parse(saved) : INITIAL_UNSENT_DRAFTS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      if (['almost-list', 'vault', 'habits', 'schedule', 'goals', 'analytics', 'rewards', 'ai-suggestions', 'settings', 'today'].includes(path)) {
        return path;
      }
    }
    return 'dashboard';
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Modals
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
  }, [theme]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}schedule`, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}goals`, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}achievements`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}suggestions`, JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}daily_wins`, JSON.stringify(dailyWins));
  }, [dailyWins]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}physical_details`, JSON.stringify(physicalDetails));
  }, [physicalDetails]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}calorie_data`, JSON.stringify(calorieData));
  }, [calorieData]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}almost_list`, JSON.stringify(almostList));
  }, [almostList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}unsent_drafts`, JSON.stringify(unsentDrafts));
  }, [unsentDrafts]);

  // URL Path History Synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.replace(/^\//, '');
      const targetPath = activeTab === 'dashboard' ? '/' : `/${activeTab}`;
      const normalizedCurrent = currentPath === '' ? 'dashboard' : currentPath;
      if (normalizedCurrent !== activeTab) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'dashboard';
      setActiveTab(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Toast dispatch
  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const LEVEL_TITLES = [
    'Novice Builder',
    'Habit Explorer',
    'Momentum Seeker',
    'Routine Architect',
    'Focus Practitioner',
    'Consistency Vanguard',
    'High Performer',
    'Zen Master',
    'Unstoppable Force',
    'Legend of Habits',
  ];

  // Add XP and check Level up
  const awardXp = (amount: number, reason: string) => {
    setUser((prev) => {
      const newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let nextLevelXp = prev.xpToNextLevel;
      let newTitle = prev.levelTitle;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp = Math.round(nextLevelXp * 1.35);
        newTitle = LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, newLevel - 1)];
        addToast(`🎉 Level Up! You reached Level ${newLevel}!`, `Title: "${newTitle}". +${amount} XP earned (${reason})`, 'achievement');
      } else {
        addToast(`+${amount} XP: ${reason}`, undefined, 'fire');
      }

      return {
        ...prev,
        currentXp: newXp,
        level: newLevel,
        levelTitle: newTitle,
        xpToNextLevel: nextLevelXp,
        totalHabitsCompleted: prev.totalHabitsCompleted + 1,
      };
    });
  };

  // Streak Freeze Actions
  const toggleStreakFreezeToday = () => {
    setUser((prev) => {
      if (prev.streakFreezeActiveToday) {
        addToast('Streak Freeze Unequipped', 'Freeze token returned to inventory.', 'info');
        return {
          ...prev,
          streakFreezeActiveToday: false,
          streakFreezes: Math.min(prev.maxStreakFreezes, prev.streakFreezes + 1),
        };
      } else {
        if (prev.streakFreezes <= 0) {
          addToast('No Freezes Available', 'Equip or purchase a streak freeze first!', 'warning');
          return prev;
        }
        addToast('❄️ Streak Freeze Activated!', 'Today is shielded! Your consistency streaks are protected from resets.', 'achievement');
        return {
          ...prev,
          streakFreezeActiveToday: true,
          streakFreezes: Math.max(0, prev.streakFreezes - 1),
        };
      }
    });
  };

  const buyStreakFreeze = () => {
    setUser((prev) => {
      if (prev.streakFreezes >= prev.maxStreakFreezes) {
        addToast('Inventory Full', `Maximum ${prev.maxStreakFreezes} freeze shields equipped.`, 'info');
        return prev;
      }
      addToast('❄️ Streak Freeze Equipped!', 'Added +1 freeze shield to your inventory.', 'success');
      return {
        ...prev,
        streakFreezes: prev.streakFreezes + 1,
      };
    });
  };

  // Daily Wins Actions
  const addDailyWin = (
    title: string,
    category: HabitCategory | 'streak' | 'personal' = 'personal',
    xp: number = 35,
    icon: string = '✨'
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newWin: DailyWin = {
      id: `win-${Date.now()}`,
      title,
      category,
      time: timeStr,
      xpEarned: xp,
      icon,
    };
    setDailyWins((prev) => [newWin, ...prev]);
    awardXp(xp, `Daily Win: ${title}`);
    addToast('🏆 Daily Win Logged!', `+${xp} XP: "${title}"`, 'achievement');
  };

  const removeDailyWin = (id: string) => {
    setDailyWins((prev) => prev.filter((w) => w.id !== id));
    addToast('Win Removed', 'Removed from daily wins.', 'info');
  };

  // Physical Details Action
  const updatePhysicalDetails = (details: Partial<PhysicalDetails>) => {
    setPhysicalDetails((prev) => ({
      ...prev,
      ...details,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
    awardXp(15, 'Updated physical details & biometrics');
    addToast('Biometrics Updated', 'Physical details & measurements saved.', 'success');
  };

  // Calorie Meter Actions
  const addCalorieMeal = (meal: Omit<CalorieMealItem, 'id'>) => {
    const newMeal: CalorieMealItem = {
      ...meal,
      id: `meal-${Date.now()}`,
    };
    setCalorieData((prev) => ({
      ...prev,
      meals: [newMeal, ...prev.meals],
    }));
    awardXp(20, `Logged food entry: "${meal.name}"`);
    addToast('Food Logged', `+${meal.calories} kcal logged for ${meal.name}.`, 'success');
  };

  const removeCalorieMeal = (id: string) => {
    setCalorieData((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== id),
    }));
    addToast('Meal Removed', 'Removed from daily food log.', 'info');
  };

  const updateCalorieTargets = (targets: Partial<CalorieMeterData>) => {
    setCalorieData((prev) => ({
      ...prev,
      ...targets,
    }));
    addToast('Calorie Goals Updated', 'Nutrition targets adjusted.', 'success');
  };

  // Almost List Actions
  const createAlmostListItem = (itemData: {
    title: string;
    shortDescription: string;
    category: AlmostListCategory;
    dateLogged?: string;
    revisitDate?: string;
  }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultRevisit = new Date();
    defaultRevisit.setMonth(defaultRevisit.getMonth() + 3);
    const defaultRevisitStr = defaultRevisit.toISOString().split('T')[0];

    const newItem: AlmostListItem = {
      id: `almost-${Date.now()}`,
      title: itemData.title.trim(),
      shortDescription: itemData.shortDescription.trim(),
      category: itemData.category,
      dateLogged: itemData.dateLogged || todayStr,
      revisitDate: itemData.revisitDate || defaultRevisitStr,
      reflections: [],
      createdAt: todayStr,
    };

    setAlmostList((prev) => [newItem, ...prev]);
    addToast('Decision Logged', 'Preserved in your Almost List. Revisit scheduled.', 'success');
  };

  const addAlmostListReflection = (itemId: string, feeling: AlmostListFeeling, note?: string) => {
    const newRef: FeelingReflection = {
      id: `ref-${Date.now()}`,
      feeling,
      timestamp: new Date().toISOString(),
      note: note?.trim() || undefined,
    };

    setAlmostList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, reflections: [...item.reflections, newRef] }
          : item
      )
    );

    const feelingLabel =
      feeling === 'still_relieved'
        ? 'Relief confirmed'
        : feeling === 'now_regret_it'
        ? 'Regret acknowledged'
        : 'Neutral feeling noted';

    addToast('Reflection Saved', `${feelingLabel}. Added to feelings timeline.`, 'info');
  };

  const deleteAlmostListItem = (id: string) => {
    setAlmostList((prev) => prev.filter((item) => item.id !== id));
    addToast('Entry Removed', 'Item removed from Almost List.', 'info');
  };

  const triggerTestRevisit = (itemId: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setAlmostList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, revisitDate: yesterdayStr } : item
      )
    );
    addToast('Revisit Ready', 'Entry revisit date moved to past for testing.', 'info');
  };

  // Unsent Drafts Vault Actions
  const createUnsentDraft = (draftData: {
    recipient: string;
    recipientType: VaultRecipientType;
    title: string;
    content: string;
  }) => {
    // Hidden randomly generated resurfacing date (1-12 months out)
    const randomMonths = Math.floor(Math.random() * 12) + 1;
    const resurfaceDate = new Date();
    resurfaceDate.setMonth(resurfaceDate.getMonth() + randomMonths);

    const newDraft: UnsentDraft = {
      id: `draft-${Date.now()}`,
      recipient: draftData.recipient.trim(),
      recipientType: draftData.recipientType,
      title: draftData.title.trim(),
      content: draftData.content.trim(),
      createdAt: new Date().toISOString(),
      resurfacingDate: resurfaceDate.toISOString(),
      reflections: [],
    };

    setUnsentDrafts((prev) => [newDraft, ...prev]);
    addToast('Letter Sealed into Vault', 'Locked and preserved. Unprompted resurfacing will occur in the future.', 'success');
  };

  const addVaultReflection = (draftId: string, response: VaultFeelingResponse) => {
    const newRef: VaultReflection = {
      id: `vref-${Date.now()}`,
      response,
      timestamp: new Date().toISOString(),
    };

    setUnsentDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? { ...d, reflections: [...d.reflections, newRef] }
          : d
      )
    );

    addToast('Check-in Recorded', 'Your perspective has been preserved.', 'info');
  };

  const deleteUnsentDraft = (id: string) => {
    setUnsentDrafts((prev) => prev.filter((d) => d.id !== id));
    addToast('Letter Discarded', 'Unsent draft removed from Vault.', 'info');
  };

  const triggerTestResurface = (draftId: string) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    setUnsentDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId ? { ...d, resurfacingDate: pastDate.toISOString() } : d
      )
    );
    addToast('Letter Resurfaced', 'Draft resurfacing triggered for review.', 'info');
  };

  // Habit Actions
  const toggleHabitToday = (habitId: string) => {
    const todayKey = new Date().toISOString().split('T')[0];
    
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const willBeComplete = !h.completedToday;
        const newStreak = willBeComplete ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
        const newBest = Math.max(h.bestStreak, newStreak);
        const newHistory = { ...h.history, [todayKey]: willBeComplete };
        const newCurrentVal = willBeComplete ? h.targetValue : 0;

        if (willBeComplete) {
          const xpAmount = h.difficulty === 'easy' ? 10 : h.difficulty === 'hard' ? 30 : 20;
          awardXp(xpAmount, `Completed "${h.name}"`);
          addToast(`✓ Completed`, `"${h.name}" completed! +${xpAmount} XP`, 'success');
        } else {
          addToast(`Habit Updated`, `"${h.name}" marked incomplete.`, 'info');
        }

        return {
          ...h,
          completedToday: willBeComplete,
          currentValue: newCurrentVal,
          currentStreak: newStreak,
          bestStreak: newBest,
          history: newHistory,
        };
      })
    );

    // Synchronize schedule item completion if linked
    setSchedule((prev) =>
      prev.map((s) => (s.habitId === habitId ? { ...s, completed: !habits.find((h) => h.id === habitId)?.completedToday } : s))
    );
  };

  const rescheduleHabit = (habitId: string, newTime: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, reminderTime: newTime } : h))
    );
    setSchedule((prev) =>
      prev.map((s) => (s.habitId === habitId ? { ...s, time: newTime } : s))
    );
    addToast('Routine adjusted ✓', `Rescheduled session to ${newTime}.`, 'success');
  };

  const incrementHabitProgress = (habitId: string, amount: number = 1) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const newVal = Math.min(h.targetValue, h.currentValue + amount);
        const isNowComplete = newVal >= h.targetValue;
        const wasComplete = h.completedToday;

        if (isNowComplete && !wasComplete) {
          awardXp(25, `Target achieved for "${h.name}"`);
        }

        return {
          ...h,
          currentValue: newVal,
          completedToday: isNowComplete,
        };
      })
    );
  };

  const createHabit = (habitData: Partial<Habit>) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name: habitData.name || 'New Habit',
      description: habitData.description || '',
      category: habitData.category || 'lifestyle',
      frequency: habitData.frequency || 'daily',
      target: habitData.target || '1 time',
      targetValue: habitData.targetValue || 1,
      currentValue: 0,
      unit: habitData.unit || 'times',
      currentStreak: 0,
      bestStreak: 0,
      completionRate: 100,
      reminderTime: habitData.reminderTime || '08:00',
      preferredTimeOfDay: habitData.preferredTimeOfDay || 'morning',
      color: habitData.color || '#10b981',
      icon: habitData.icon || 'CheckCircle',
      completedToday: false,
      paused: false,
      history: { [todayKey]: false },
      createdAt: todayKey,
      relatedGoalId: habitData.relatedGoalId,
      difficulty: habitData.difficulty || 'medium',
    };

    setHabits((prev) => [newHabit, ...prev]);
    awardXp(40, 'Created a new habit routine');
    addToast('Habit Created', `"${newHabit.name}" added to your routine.`);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
    addToast('Habit Updated', 'Your changes have been saved.');
  };

  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find((h) => h.id === id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    // Also remove habit association in schedule
    setSchedule((prev) => prev.map((s) => s.habitId === id ? { ...s, habitId: undefined } : s));
    addToast('Habit Removed', `"${habitToDelete?.name || 'Habit'}" was deleted.`, 'info');
  };

  const togglePauseHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const newPaused = !h.paused;
        addToast(newPaused ? 'Habit Paused' : 'Habit Resumed', `"${h.name}" is now ${newPaused ? 'paused' : 'active'}.`, 'info');
        return { ...h, paused: newPaused };
      })
    );
  };

  // Schedule Actions
  const toggleScheduleItem = (id: string) => {
    setSchedule((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const willBeComplete = !s.completed;
        if (willBeComplete) {
          awardXp(15, `Routine item: "${s.name}"`);
        }
        return { ...s, completed: willBeComplete };
      })
    );
  };

  const createScheduleItem = (itemData: Partial<ScheduleItem>) => {
    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      time: itemData.time || '10:00',
      durationMinutes: itemData.durationMinutes || 30,
      name: itemData.name || 'New Routine Block',
      category: itemData.category || 'productivity',
      completed: false,
      reminderEnabled: itemData.reminderEnabled ?? true,
      color: itemData.color || '#10b981',
      icon: itemData.icon || 'Clock',
      habitId: itemData.habitId,
      notes: itemData.notes || '',
    };

    setSchedule((prev) => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    addToast('Schedule Updated', `"${newItem.name}" added at ${newItem.time}.`);
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
    addToast('Activity Removed', 'The item was removed from your schedule.', 'info');
  };

  // Goal Actions
  const createGoal = (goalData: Partial<Goal>) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalData.title || 'New Milestone Goal',
      description: goalData.description || '',
      targetValue: goalData.targetValue || 10,
      currentValue: goalData.currentValue || 0,
      unit: goalData.unit || 'units',
      deadline: goalData.deadline || '2026-12-31',
      progressPercentage: Math.round(((goalData.currentValue || 0) / (goalData.targetValue || 10)) * 100),
      relatedHabitIds: goalData.relatedHabitIds || [],
      category: goalData.category || 'productivity',
      completed: false,
      createdAt: todayKey,
    };

    setGoals((prev) => [newGoal, ...prev]);
    awardXp(50, 'Set a new long-term goal');
    addToast('Goal Created', `"${newGoal.title}" is now being tracked.`);
  };

  const updateGoalProgress = (id: string, newValue: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const cappedVal = Math.min(g.targetValue, Math.max(0, newValue));
        const pct = Math.min(100, Math.round((cappedVal / g.targetValue) * 100));
        const isComplete = pct >= 100;
        if (isComplete && !g.completed) {
          awardXp(150, `Crushed Goal: "${g.title}"!`);
          addToast('🏆 Goal Completed!', `Outstanding work! You finished "${g.title}".`, 'achievement');
        }
        return {
          ...g,
          currentValue: cappedVal,
          progressPercentage: pct,
          completed: isComplete,
        };
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    addToast('Goal Deleted', 'The goal was removed.', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All marked as read.', 'info');
  };

  // AI Suggestions
  const applySuggestion = (id: string) => {
    const sug = suggestions.find((s) => s.id === id);
    if (!sug) return;

    // Apply logic depending on type
    if (sug.type === 'schedule_adjust' && sug.suggestedTime && sug.targetHabitId) {
      setHabits((prev) =>
        prev.map((h) => (h.id === sug.targetHabitId ? { ...h, reminderTime: sug.suggestedTime } : h))
      );
      setSchedule((prev) =>
        prev.map((s) => (s.habitId === sug.targetHabitId ? { ...s, time: sug.suggestedTime! } : s))
      );
    }

    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, applied: true } : s))
    );

    awardXp(30, 'Applied AI habit recommendation');
    addToast('Suggestion Applied ✨', `Implemented: "${sug.title}"`, 'success');
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, dismissed: true } : s))
    );
    addToast('Suggestion Dismissed', 'Recommendation hidden from dashboard.', 'info');
  };

  // User Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    addToast('Settings Saved', 'Profile preferences updated.');
  };

  // Data reset & export
  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}habits`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}schedule`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}goals`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notifications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}achievements`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}suggestions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}almost_list`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}unsent_drafts`);
    
    setUser(INITIAL_USER);
    setHabits(INITIAL_HABITS);
    setSchedule(INITIAL_SCHEDULE);
    setGoals(INITIAL_GOALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSuggestions(INITIAL_SUGGESTIONS);
    setAlmostList(INITIAL_ALMOST_LIST);
    setUnsentDrafts(INITIAL_UNSENT_DRAFTS);

    addToast('Demo Data Restored', 'All sample routines and metrics have been reset.', 'info');
  };

  const exportDataJson = () => {
    const data = {
      user,
      habits,
      schedule,
      goals,
      notifications,
      achievements,
      almostList,
      unsentDrafts,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitflow-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Data Exported', 'HabitFlow data downloaded as JSON file.', 'success');
  };

  // Computed metrics
  const activeHabits = habits.filter((h) => !h.paused);
  const totalActiveHabitsCount = activeHabits.length;
  const habitsCompletedTodayCount = activeHabits.filter((h) => h.completedToday).length;
  const todayCompletionRate = totalActiveHabitsCount > 0
    ? Math.round((habitsCompletedTodayCount / totalActiveHabitsCount) * 100)
    : 0;

  const activeStreaksCount = activeHabits.filter((h) => h.currentStreak > 0).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  
  // Dynamic productivity score (weight: habits completion 40%, schedule adherence 30%, streaks 20%, focus consistency 10%)
  const scheduleDone = schedule.filter((s) => s.completed).length;
  const scheduleTotal = schedule.length || 1;
  const schedulePct = (scheduleDone / scheduleTotal) * 100;
  const productivityScore = Math.min(
    100,
    Math.round(todayCompletionRate * 0.45 + schedulePct * 0.35 + 20)
  );

  // Almost List & Vault computed metrics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const readyToRevisitCount = almostList.filter(
    (item) => todayDateStr >= item.revisitDate && item.reflections.length === 0
  ).length;

  const nowEpoch = new Date().getTime();
  const resurfacedVaultCount = unsentDrafts.filter(
    (draft) => new Date(draft.resurfacingDate).getTime() <= nowEpoch && draft.reflections.length === 0
  ).length;

  return (
    <AppContext.Provider
      value={{
        user,
        habits,
        schedule,
        goals,
        notifications,
        achievements,
        suggestions,
        analytics,
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,
        
        isCreateHabitOpen,
        setIsCreateHabitOpen,
        isCreateGoalOpen,
        setIsCreateGoalOpen,
        isCreateScheduleOpen,
        setIsCreateScheduleOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        editingHabit,
        setEditingHabit,

        toggleHabitToday,
        rescheduleHabit,
        incrementHabitProgress,
        createHabit,
        updateHabit,
        deleteHabit,
        togglePauseHabit,
        
        toggleScheduleItem,
        createScheduleItem,
        deleteScheduleItem,
        
        createGoal,
        updateGoalProgress,
        deleteGoal,
        
        markNotificationAsRead,
        markAllNotificationsAsRead,
        
        applySuggestion,
        dismissSuggestion,
        
        dailyWins,
        addDailyWin,
        removeDailyWin,
        toggleStreakFreezeToday,
        buyStreakFreeze,
        awardXp,

        physicalDetails,
        updatePhysicalDetails,
        calorieData,
        addCalorieMeal,
        removeCalorieMeal,
        updateCalorieTargets,
        currentTrackerView,
        setCurrentTrackerView,

        almostList,
        createAlmostListItem,
        addAlmostListReflection,
        deleteAlmostListItem,
        triggerTestRevisit,
        readyToRevisitCount,

        unsentDrafts,
        createUnsentDraft,
        addVaultReflection,
        deleteUnsentDraft,
        triggerTestResurface,
        resurfacedVaultCount,

        updateUserProfile,
        resetDemoData,
        exportDataJson,

        toasts,
        addToast,
        removeToast,

        todayCompletionRate,
        habitsCompletedTodayCount,
        totalActiveHabitsCount,
        activeStreaksCount,
        longestStreak,
        productivityScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
