'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HabitCard } from '@/components/habit-card';
import { CreateHabitDialog } from '@/components/create-habit-dialog';
import { LogEntryDialog } from '@/components/log-entry-dialog';
import { EditHabitDialog } from '@/components/edit-habit-dialog';
import { EnhancedGymDialog } from '@/components/enhanced-gym-dialog';
import { CalendarHeatmap } from '@/components/calendar-heatmap';
import { AchievementsPanel } from '@/components/achievements-panel';
import { FocusMode } from '@/components/focus-mode';
import { NotificationSystem } from '@/components/notification-system';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, Calendar, Trophy, Target, Zap, Brain, Bell, Settings, LogOut, Edit, Trash2 } from 'lucide-react';
import { Habit, Streak } from '@/lib/types';
import { useTheme } from '@/components/theme-provider';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  earnedAt?: string;
}

export default function Home() {
  const [habits, setHabits] = useState<(Habit & { streak?: Streak; todayProgress?: number })[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({ totalPoints: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedHabitForLog, setSelectedHabitForLog] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      // Auto-authenticate for demo purposes
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', 'Demo User');
      localStorage.setItem('userEmail', 'demo@example.com');
      localStorage.setItem('isGuest', 'true');
    }

    fetchHabits();
    fetchAchievements();
  }, [router]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements);
        setUserStats({ totalPoints: data.totalPoints, level: data.level });
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        const habitsWithProgress = data.map((habit: any) => ({
          ...habit,
          streak: habit.streaks?.[0],
          todayProgress: calculateTodayProgress(habit)
        }));
        setHabits(habitsWithProgress);
        generateHeatmapData(habitsWithProgress);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayProgress = (habit: any): number => {
    const today = new Date().toDateString();
    const todayEntry = habit.entries?.find((entry: any) => 
      new Date(entry.date).toDateString() === today
    );
    
    if (todayEntry?.completed) return 100;
    return 0;
  };

  const generateHeatmapData = (habits: any[]) => {
    const data: Record<string, number> = {};
    const today = new Date();
    
    // Generate data for the last 90 days
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate completion percentage for this date
      const completedHabits = habits.filter(habit => {
        const entry = habit.entries?.find((entry: any) => 
          new Date(entry.date).toDateString() === date.toDateString()
        );
        return entry?.completed;
      }).length;
      
      const completionPercentage = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;
      data[dateStr] = completionPercentage;
    }
    
    setHeatmapData(data);
  };

  const handleCreateHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        fetchHabits();
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleSaveCustomTemplate = (template: any) => {
    console.log('Saving custom template:', template);
    try {
      // Save the custom template to localStorage or send to API
      const savedTemplates = JSON.parse(localStorage.getItem('custom-workout-templates') || '[]');
      savedTemplates.push(template);
      localStorage.setItem('custom-workout-templates', JSON.stringify(savedTemplates));
      
      // Show success message
      alert('Custom workout template saved successfully!');
      console.log('Template saved successfully:', savedTemplates);
    } catch (error) {
      console.error('Error saving custom template:', error);
      alert('Error saving template. Please try again.');
    }
  };

  const handleLogEntry = async (habitId: string, data: Record<string, any>, notes?: string) => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habitId, value: data, notes }),
      });

      if (response.ok) {
        fetchHabits();
      }
    } catch (error) {
      console.error('Error logging entry:', error);
    }
  };

  const handleEditHabit = (habitId: string) => {
    setEditingHabit(habitId);
  };

  const handleUpdateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchHabits();
        setEditingHabit(null);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      alert('Error updating habit. Please try again.');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchHabits();
        setEditingHabit(null);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Error deleting habit. Please try again.');
    }
  };

  const getHabitEntries = (habitId: string) => {
    return habits.find(h => h.id === habitId)?.entries || [];
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isGuest');
    router.push('/login');
  };

  const activeHabits = habits.filter(h => h.isActive);
  const completedToday = activeHabits.filter(h => h.todayProgress === 100).length;
  const totalActive = activeHabits.length;
  const currentStreaks = activeHabits.reduce((sum, h) => sum + (h.streak?.current || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card mobile-header">
        <div className="container mx-auto px-4 py-4">
          <div className="header-content">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Habit Tracker</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Welcome back, {localStorage.getItem('userName') || 'User'}!
              </p>
            </div>
            <div className="flex items-center gap-2 desktop-only">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFocusMode(true)}
                className="touch-target flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Focus Mode</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(true)}
                className="touch-target flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alarms</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="touch-target flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedToday}/{totalActive}</div>
              <p className="text-xs text-muted-foreground">habits completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streaks</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreaks}</div>
              <p className="text-xs text-muted-foreground">days across all habits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActive}</div>
              <p className="text-xs text-muted-foreground">habits being tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...activeHabits.map(h => h.streak?.best || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">longest streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="habits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Today's Habits
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Habit
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="space-y-6">
            {activeHabits.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building better habits by creating your first one!
                  </p>
                  <CreateHabitDialog 
                    onCreateHabit={handleCreateHabit}
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Habit
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeHabits.map((habit) => (
                  habit.type === 'gym' ? (
                    <EnhancedGymDialog
                      key={habit.id}
                      habit={habit}
                      entries={getHabitEntries(habit.id)}
                      onLogEntry={handleLogEntry}
                      onSaveCustomTemplate={handleSaveCustomTemplate}
                      trigger={
                        <div onClick={() => setSelectedHabitForLog(habit.id)}>
                          <HabitCard
                            habit={habit}
                            onLogEntry={() => setSelectedHabitForLog(habit.id)}
                            onEdit={handleEditHabit}
                            onDelete={handleDeleteHabit}
                          />
                        </div>
                      }
                    />
                  ) : (
                    <LogEntryDialog
                      key={habit.id}
                      habit={habit}
                      onLogEntry={handleLogEntry}
                      trigger={
                        <div onClick={() => setSelectedHabitForLog(habit.id)}>
                          <HabitCard
                            habit={habit}
                            onLogEntry={() => setSelectedHabitForLog(habit.id)}
                            onEdit={handleEditHabit}
                            onDelete={handleDeleteHabit}
                          />
                        </div>
                      }
                    />
                  )
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CalendarHeatmap 
                data={heatmapData}
                month={new Date()}
              />
              <CalendarHeatmap 
                data={heatmapData}
                month={new Date(new Date().setMonth(new Date().getMonth() - 1))}
              />
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CreateHabitDialog 
              onCreateHabit={handleCreateHabit}
              trigger={
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Habit
                </Button>
              }
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFocusMode(true)}
                    className="flex items-center gap-2 h-20 flex-col touch-target"
                  >
                    <Brain className="h-8 w-8" />
                    <span>Focus Mode</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNotifications(true)}
                    className="flex items-center gap-2 h-20 flex-col touch-target"
                  >
                    <Bell className="h-8 w-8" />
                    <span>Alarms & Notifications</span>
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  <p>Current theme: {resolvedTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}</p>
                  <p className="responsive-text-xs mt-2">
                    App adapts to your screen size for optimal experience
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        <TabsContent value="achievements" className="space-y-6">
            <AchievementsPanel 
              achievements={achievements}
              totalPoints={userStats.totalPoints}
              level={userStats.level}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <FocusMode 
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        habits={habits}
      />
      
      <NotificationSystem 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        habits={habits}
      />
    </div>
  );
}