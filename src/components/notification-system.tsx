'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  BellOff, 
  Clock, 
  Mail, 
  Plus, 
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Alarm {
  id: string;
  time: string;
  habit: string;
  enabled: boolean;
  days: string[];
  sound: string;
  emailNotification: boolean;
}

interface NotificationSystemProps {
  habits: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSystem({ habits, isOpen, onClose }: NotificationSystemProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    time: '09:00',
    enabled: true,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    sound: 'default',
    emailNotification: true
  });
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAddress, setEmailAddress] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    // Load saved alarms
    const savedAlarms = localStorage.getItem('habit-alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }

    // Load notification settings
    const savedEmail = localStorage.getItem('notification-email');
    const savedSound = localStorage.getItem('notification-sound');
    setEmailEnabled(savedEmail === 'true');
    setSoundEnabled(savedSound !== 'false');
    setEmailAddress(savedEmail || '');

    // Check alarms every minute
    intervalRef.current = setInterval(checkAlarms, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const checkAlarms = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = weekDays[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Monday start

    alarms.forEach(alarm => {
      if (alarm.enabled && alarm.time === currentTime && alarm.days.includes(currentDay)) {
        triggerAlarm(alarm);
      }
    });
  };

  const triggerAlarm = async (alarm: Alarm) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Habit Reminder', {
        body: `Time for: ${alarm.habit}`,
        icon: '/icon-192x192.png',
        tag: alarm.id
      });
    }

    // Gmail notification
    if (alarm.emailNotification && emailEnabled && emailAddress) {
      await sendGmailNotification(alarm);
    }

    // Sound notification
    if (soundEnabled) {
      playAlarmSound();
    }
  };

  const sendGmailNotification = async (alarm: Alarm) => {
    try {
      // This would need to be implemented with Gmail API
      // For now, we'll simulate it
      console.log('Gmail notification sent:', alarm);
    } catch (error) {
      console.error('Failed to send Gmail notification:', error);
    }
  };

  const playAlarmSound = () => {
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(e => console.log('Failed to play sound:', e));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  const addAlarm = () => {
    if (!newAlarm.habit || !newAlarm.time) return;

    const alarm: Alarm = {
      id: Date.now().toString(),
      habit: newAlarm.habit!,
      time: newAlarm.time!,
      enabled: newAlarm.enabled ?? true,
      days: newAlarm.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      sound: newAlarm.sound || 'default',
      emailNotification: newAlarm.emailNotification ?? true
    };

    const updatedAlarms = [...alarms, alarm];
    setAlarms(updatedAlarms);
    localStorage.setItem('habit-alarms', JSON.stringify(updatedAlarms));

    // Reset form
    setNewAlarm({
      time: '09:00',
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      sound: 'default',
      emailNotification: true
    });
  };

  const removeAlarm = (id: string) => {
    const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
    setAlarms(updatedAlarms);
    localStorage.setItem('habit-alarms', JSON.stringify(updatedAlarms));
  };

  const toggleAlarm = (id: string) => {
    const updatedAlarms = alarms.map(alarm =>
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    );
    setAlarms(updatedAlarms);
    localStorage.setItem('habit-alarms', JSON.stringify(updatedAlarms));
  };

  const saveNotificationSettings = () => {
    localStorage.setItem('notification-email', emailEnabled.toString());
    localStorage.setItem('notification-sound', soundEnabled.toString());
    if (emailEnabled && emailAddress) {
      localStorage.setItem('notification-email-address', emailAddress);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Alarms & Notifications
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Switch 
                    id="email-notifications"
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                  <span className="text-sm text-muted-foreground">
                    {emailEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sound-notifications">Sound Notifications</Label>
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <Switch 
                    id="sound-notifications"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                  <span className="text-sm text-muted-foreground">
                    {soundEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {emailEnabled && (
              <div className="space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="Enter your email for notifications"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Gmail notifications will be sent to this address
                </p>
              </div>
            )}

            <Button onClick={saveNotificationSettings} className="w-full">
              Save Notification Settings
            </Button>
          </div>

          {/* Add New Alarm */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Alarm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alarm-time">Time</Label>
                <Input
                  id="alarm-time"
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alarm-habit">Habit</Label>
                <Select value={newAlarm.habit} onValueChange={(value) => setNewAlarm(prev => ({ ...prev, habit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a habit" />
                  </SelectTrigger>
                  <SelectContent>
                    {habits.map((habit) => (
                      <SelectItem key={habit.id} value={habit.title}>
                        {habit.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Repeat Days</Label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <Badge
                    key={day}
                    variant={newAlarm.days?.includes(day) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const days = newAlarm.days || [];
                      if (days.includes(day)) {
                        setNewAlarm(prev => ({ ...prev, days: days.filter(d => d !== day) }));
                      } else {
                        setNewAlarm(prev => ({ ...prev, days: [...days, day] }));
                      }
                    }}
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={addAlarm} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Alarm
            </Button>
          </div>

          {/* Active Alarms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Alarms</h3>
            {alarms.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No alarms set yet. Create your first alarm above!
              </p>
            ) : (
              <div className="space-y-3">
                {alarms.map((alarm) => (
                  <Card key={alarm.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-mono">{alarm.time}</div>
                        <div>
                          <div className="font-medium">{alarm.habit}</div>
                          <div className="text-sm text-muted-foreground">
                            {alarm.days.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAlarm(alarm.id)}
                        >
                          {alarm.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAlarm(alarm.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}