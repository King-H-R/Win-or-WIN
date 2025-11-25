'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Clock, 
  Target, 
  Zap, 
  Moon, 
  Sun, 
  X,
  Play,
  Pause,
  RotateCcw,
  Bell,
  BellOff
} from 'lucide-react';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  habits: any[];
}

interface FocusMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: number;
  features: string[];
  color: string;
}

const focusModes: FocusMode[] = [
  {
    id: 'deep-work',
    name: 'Deep Work',
    icon: <Brain className="h-6 w-6" />,
    description: 'Maximum concentration for complex tasks',
    duration: 90,
    features: ['Block distractions', 'Extended focus time', 'Progressive difficulty'],
    color: 'bg-purple-500'
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    icon: <Clock className="h-6 w-6" />,
    description: '25-minute focused sessions with breaks',
    duration: 25,
    features: ['Time boxing', 'Regular breaks', 'Sustainable productivity'],
    color: 'bg-blue-500'
  },
  {
    id: 'flow-state',
    name: 'Flow State',
    icon: <Zap className="h-6 w-6" />,
    description: 'Optimal performance for creative work',
    duration: 60,
    features: ['Minimal friction', 'Immersive environment', 'Peak performance'],
    color: 'bg-green-500'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: <Moon className="h-6 w-6" />,
    description: 'Calm focus for meditation and reflection',
    duration: 30,
    features: ['Gentle reminders', 'Breathing guidance', 'Stress reduction'],
    color: 'bg-indigo-500'
  }
];

export function FocusMode({ isOpen, onClose, habits }: FocusModeProps) {
  const [selectedMode, setSelectedMode] = useState<FocusMode>(focusModes[1]);
  const [selectedHabit, setSelectedHabit] = useState<string>('');
  const [duration, setDuration] = useState<number>(25);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [progress, setProgress] = useState<number>(0);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const totalTime = duration * 60;
          const currentProgress = ((totalTime - newTime) / totalTime) * 100;
          setProgress(currentProgress);
          
          if (newTime <= 0) {
            setIsActive(false);
            // Send notification
            if (notifications) {
              sendNotification('Focus session completed!', `Great job! You completed your ${selectedMode.name} session.`);
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, duration, notifications, selectedMode]);

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192x192.png'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const startFocus = () => {
    setIsActive(true);
    setTimeLeft(duration * 60);
    setProgress(0);
    requestNotificationPermission();
  };

  const pauseFocus = () => {
    setIsActive(false);
  };

  const resetFocus = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Focus Mode
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Focus Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {focusModes.map((mode) => (
                <Card 
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedMode.id === mode.id 
                      ? 'ring-2 ring-offset-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedMode(mode)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg text-white ${mode.color}`}>
                        {mode.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{mode.name}</h4>
                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {mode.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Habit Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Habit to Focus On</h3>
            <select 
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="w-full p-3 border rounded-lg bg-background"
            >
              <option value="">Choose a habit...</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.title}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Session Duration</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-lg font-semibold">{duration} minutes</span>
              </div>
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                max={120}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
                <Switch 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🔊</span>
                  <span>Sound Effects</span>
                </div>
                <Switch 
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>
          </div>

          {/* Active Session */}
          {isActive && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Focus Session</h3>
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl font-bold font-mono mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={progress} className="w-full mb-4" />
                  <div className="text-sm text-muted-foreground">
                    {selectedMode.name} • {selectedHabit ? habits.find(h => h.id === selectedHabit)?.title : 'No habit selected'}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isActive ? (
              <Button 
                onClick={startFocus}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                disabled={!selectedHabit}
              >
                <Play className="h-4 w-4" />
                Start Focus Session
              </Button>
            ) : (
              <>
                <Button 
                  onClick={pauseFocus}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button 
                  onClick={resetFocus}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}