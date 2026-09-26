export type HabitCategory = 'health' | 'fitness' | 'mindfulness' | 'productivity' | 'learning' | 'lifestyle';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export type HabitDifficulty = 'easy' | 'medium' | 'hard';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  target: string; // e.g. "8 glasses", "30 mins", "1 session"
  targetValue: number; // numeric target per day
  currentValue: number; // today's progress
  unit: string; // e.g. "mins", "glasses", "pages"
  currentStreak: number;
  bestStreak: number;
  completionRate: number; // percentage 0-100
  reminderTime?: string; // "07:30"
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  color: string; // hex or tailwind token
  icon: string; // Lucide icon name
  completedToday: boolean;
  paused: boolean;
  history: { [dateStr: string]: boolean }; // YYYY-MM-DD -> boolean
  createdAt: string;
  relatedGoalId?: string;
  difficulty: HabitDifficulty;
}

export interface ScheduleItem {
  id: string;
  time: string; // "07:00"
  durationMinutes: number;
  name: string;
  category: HabitCategory;
  completed: boolean;
  reminderEnabled: boolean;
  color: string;
  icon: string;
  habitId?: string;
  dayOfWeek?: number; // 0-6 or null for daily
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string; // YYYY-MM-DD
  progressPercentage: number;
  relatedHabitIds: string[];
  category: HabitCategory;
  completed: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string; // "10 mins ago", "1 hour ago", or ISO
  type: 'streak' | 'reminder' | 'achievement' | 'insight';
  read: boolean;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string; // emoji or badge style
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
  xpReward: number;
  category: 'streak' | 'habits' | 'consistency' | 'special';
}

export interface UserProfile {
  name: string;
  tagline: string;
  email: string;
  avatar: string;
  startOfDay: string; // "06:00"
  theme: 'light' | 'dark' | 'system';
  weekStartsOn: 'monday' | 'sunday';
  level: number;
  levelTitle?: string;
  currentXp: number;
  xpToNextLevel: number;
  totalHabitsCompleted: number;
  streakFreezes: number;
  maxStreakFreezes: number;
  streakFreezeActiveToday: boolean;
  soundEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smartReminders: boolean;
}

export interface DailyWin {
  id: string;
  title: string;
  category: HabitCategory | 'streak' | 'personal';
  time: string;
  xpEarned: number;
  icon?: string;
}

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  rationale: string;
  type: 'schedule_adjust' | 'habit_add' | 'habit_tweak' | 'routine_optimize';
  impact: 'high' | 'medium' | 'low';
  category: HabitCategory;
  applied: boolean;
  dismissed: boolean;
  targetHabitId?: string;
  suggestedTime?: string;
}

export interface DayAnalytics {
  date: string; // "2026-09-25"
  dayName: string; // "Mon", "Tue"
  completionRate: number; // 0 - 100
  habitsCompleted: number;
  habitsTotal: number;
  productivityScore: number;
}

export interface PhysicalDetails {
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  age: number;
  gender: 'female' | 'male' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  bodyFatPercentage?: number;
  restingHeartRate?: number;
  bloodPressure?: string;
  lastUpdated: string;
}

export interface CalorieMealItem {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
}

export interface CalorieMeterData {
  dailyTargetCalories: number;
  burnedCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  meals: CalorieMealItem[];
}

// ==========================================
// Module 1: Almost List Types
// ==========================================
export type AlmostListCategory = 'career' | 'relationship' | 'travel' | 'creative' | 'other';
export type AlmostListFeeling = 'still_relieved' | 'now_regret_it' | 'neutral_now';
export type AlmostListStatus = 'waiting' | 'ready_to_revisit' | 'resolved';

export interface FeelingReflection {
  id: string;
  feeling: AlmostListFeeling;
  timestamp: string; // ISO string
  note?: string;
}

export interface AlmostListItem {
  id: string;
  title: string;
  shortDescription: string;
  category: AlmostListCategory;
  dateLogged: string; // YYYY-MM-DD
  revisitDate: string; // YYYY-MM-DD (default 3 months from creation)
  reflections: FeelingReflection[]; // history of feelings over time
  createdAt?: string;
}

// ==========================================
// Module 2: Unsent Drafts Vault Types
// ==========================================
export type VaultRecipientType = 'ex' | 'estranged_friend' | 'passed_away' | 'younger_self' | 'future_self' | 'other';
export type VaultFeelingResponse = 'yes' | 'no' | 'complicated';

export interface VaultReflection {
  id: string;
  response: VaultFeelingResponse;
  timestamp: string; // ISO string
}

export interface UnsentDraft {
  id: string;
  recipient: string;
  recipientType: VaultRecipientType;
  title: string;
  content: string; // locked: no editing, no exporting, no sending — reread only
  createdAt: string; // ISO string
  resurfacingDate: string; // hidden randomly generated date 1–12 months out
  reflections: VaultReflection[];
}
