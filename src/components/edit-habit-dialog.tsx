'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';

interface EditHabitDialogProps {
  habit: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (habitId: string, updates: any) => void;
}

const habitTypes = [
  { value: 'running', label: 'Running', icon: '🏃' },
  { value: 'gym', label: 'Gym Workout', icon: '💪' },
  { value: 'study', label: 'Study Session', icon: '📚' },
  { value: 'meditation', label: 'Meditation', icon: '🧘' },
  { value: 'custom', label: 'Custom', icon: '⭐' },
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const weekDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export function EditHabitDialog({ habit, isOpen, onClose, onUpdate }: EditHabitDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'custom',
    theme: { color: '#3B82F6', icon: '⭐' },
    recurrence: { frequency: 'daily', days: [] },
    metrics: [],
    isActive: true,
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title || '',
        description: habit.description || '',
        type: habit.type || 'custom',
        theme: habit.theme || { color: '#3B82F6', icon: '⭐' },
        recurrence: habit.recurrence || { frequency: 'daily', days: [] },
        metrics: habit.metrics || [],
        isActive: habit.isActive !== undefined ? habit.isActive : true,
      });
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    onUpdate(habit.id, formData);
  };

  const handleDayToggle = (day: string) => {
    const currentDays = formData.recurrence.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        days: newDays
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Habit
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Morning Run"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Habit Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {habitTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your habit and why it's important to you..."
              rows={3}
            />
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <Label>Schedule</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.recurrence.frequency} onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, frequency: value }
                }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.recurrence.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Select Days</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={formData.recurrence.days?.includes(day.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day.value)}
                        className="justify-start"
                      >
                        {day.label.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="isActive">Active</Label>
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <Badge variant={formData.isActive ? "default" : "secondary"}>
              {formData.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}