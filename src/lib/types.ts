export interface HabitTheme {
  color: string;
  accent: string;
  icon: string;
}

export interface HabitRecurrence {
  frequency: 'daily' | 'weekly' | 'custom';
  days?: string[]; // ['Mon', 'Wed', 'Fri']
  target?: {
    unit: string;
    value: number;
  };
}

export interface HabitMetric {
  name: string;
  type: 'boolean' | 'counter' | 'timer' | 'numeric' | 'distance';
  unit?: string;
  required?: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'running' | 'gym' | 'calisthenics' | 'study' | 'gaming' | 'custom';
  theme: HabitTheme;
  recurrence: HabitRecurrence;
  metrics: HabitMetric[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  value: Record<string, any>;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface Streak {
  id: string;
  habitId: string;
  current: number;
  best: number;
  lastCompleted?: string;
  createdAt: string;
  updatedAt: string;
}

export const HABIT_TEMPLATES = {
  running: {
    title: 'Morning Run',
    description: 'Track your daily runs',
    type: 'running' as const,
    theme: { color: '#1E90FF', accent: '#FFD166', icon: '🏃' },
    recurrence: { frequency: 'weekly' as const, days: ['Mon', 'Wed', 'Fri'], target: { unit: 'km', value: 5 } },
    metrics: [
      { name: 'distance', type: 'distance' as const, unit: 'km', required: true },
      { name: 'duration', type: 'timer' as const, unit: 'min', required: true },
      { name: 'pace', type: 'numeric' as const, unit: 'min/km', required: false },
      { name: 'effort', type: 'numeric' as const, unit: '1-10', required: false }
    ]
  },
  gym: {
    title: 'Gym Workout',
    description: 'Strength training sessions',
    type: 'gym' as const,
    theme: { color: '#FF6B6B', accent: '#4ECDC4', icon: '💪' },
    recurrence: { frequency: 'weekly' as const, days: ['Tue', 'Thu', 'Sat'], target: { unit: 'sessions', value: 3 } },
    metrics: [
      { name: 'duration', type: 'timer' as const, unit: 'min', required: true },
      { name: 'exercises', type: 'counter' as const, unit: 'exercises', required: false },
      { name: 'rpe', type: 'numeric' as const, unit: '1-10', required: false }
    ]
  },
  study: {
    title: 'Study Session',
    description: 'Focus time for learning',
    type: 'study' as const,
    theme: { color: '#6A5ACD', accent: '#9AD3BC', icon: '📚' },
    recurrence: { frequency: 'daily' as const, target: { unit: 'hours', value: 2 } },
    metrics: [
      { name: 'duration', type: 'timer' as const, unit: 'min', required: true },
      { name: 'pomodoros', type: 'counter' as const, unit: 'sessions', required: false },
      { name: 'focus_quality', type: 'numeric' as const, unit: '1-10', required: false }
    ]
  },
  meditation: {
    title: 'Meditation',
    description: 'Daily mindfulness practice',
    type: 'custom' as const,
    theme: { color: '#00A86B', accent: '#F7B267', icon: '🧘' },
    recurrence: { frequency: 'daily' as const, target: { unit: 'min', value: 10 } },
    metrics: [
      { name: 'duration', type: 'timer' as const, unit: 'min', required: true },
      { name: 'type', type: 'boolean' as const, unit: 'guided', required: false }
    ]
  },
  water: {
    title: 'Water Intake',
    description: 'Stay hydrated throughout the day',
    type: 'custom' as const,
    theme: { color: '#00CED1', accent: '#FFB6C1', icon: '💧' },
    recurrence: { frequency: 'daily' as const, target: { unit: 'ml', value: 2000 } },
    metrics: [
      { name: 'amount', type: 'numeric' as const, unit: 'ml', required: true }
    ]
  }
};