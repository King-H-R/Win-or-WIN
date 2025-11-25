'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, Target, Calendar } from 'lucide-react';
import { HABIT_TEMPLATES, Habit, HabitTheme, HabitRecurrence, HabitMetric } from '@/lib/types';

interface CreateHabitDialogProps {
  onCreateHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  trigger?: React.ReactNode;
}

export function CreateHabitDialog({ onCreateHabit, trigger }: CreateHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customHabit, setCustomHabit] = useState({
    title: '',
    description: '',
    type: 'custom' as const,
    theme: { color: '#6B7280', accent: '#9CA3AF', icon: '⭐' } as HabitTheme,
    recurrence: { frequency: 'daily' as const, target: { unit: 'times', value: 1 } } as HabitRecurrence,
    metrics: [{ name: 'completed', type: 'boolean' as const, required: true }] as HabitMetric[]
  });

  const handleTemplateSelect = (templateKey: string) => {
    const template = HABIT_TEMPLATES[templateKey as keyof typeof HABIT_TEMPLATES];
    if (template) {
      setSelectedTemplate(templateKey);
      setCustomHabit({
        title: template.title,
        description: template.description,
        type: template.type,
        theme: template.theme,
        recurrence: template.recurrence,
        metrics: template.metrics
      });
    }
  };

  const handleCreate = () => {
    if (!customHabit.title.trim()) return;
    
    onCreateHabit(customHabit);
    setOpen(false);
    setSelectedTemplate('');
    setCustomHabit({
      title: '',
      description: '',
      type: 'custom',
      theme: { color: '#6B7280', accent: '#9CA3AF', icon: '⭐' },
      recurrence: { frequency: 'daily', target: { unit: 'times', value: 1 } },
      metrics: [{ name: 'completed', type: 'boolean', required: true }]
    });
  };

  const habitThemes = [
    { name: 'Running', color: '#1E90FF', accent: '#FFD166', icon: '🏃' },
    { name: 'Gym', color: '#FF6B6B', accent: '#4ECDC4', icon: '💪' },
    { name: 'Calisthenics', color: '#00A86B', accent: '#F7B267', icon: '🤸' },
    { name: 'Study', color: '#6A5ACD', accent: '#9AD3BC', icon: '📚' },
    { name: 'Gaming', color: '#7F00FF', accent: '#00D2FF', icon: '🎮' },
    { name: 'Meditation', color: '#00A86B', accent: '#F7B267', icon: '🧘' },
    { name: 'Water', color: '#00CED1', accent: '#FFB6C1', icon: '💧' },
    { name: 'Custom', color: '#6B7280', accent: '#9CA3AF', icon: '⭐' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create New Habit
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Templates */}
          <div>
            <Label className="text-sm font-medium">Quick Start Templates</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {Object.entries(HABIT_TEMPLATES).map(([key, template]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTemplate === key ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(key)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span>{template.theme.icon}</span>
                      {template.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {template.recurrence.frequency}
                      </Badge>
                      {template.recurrence.target && (
                        <Badge variant="outline" className="text-xs">
                          {template.recurrence.target.value} {template.recurrence.target.unit}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Habit Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Habit Name</Label>
              <Input
                id="title"
                value={customHabit.title}
                onChange={(e) => setCustomHabit(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Morning Run, Read 30 minutes"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={customHabit.description}
                onChange={(e) => setCustomHabit(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your habit and why it matters to you..."
                rows={2}
              />
            </div>

            {/* Theme Selection */}
            <div>
              <Label>Theme & Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {habitThemes.map((theme) => (
                  <Button
                    key={theme.name}
                    variant="outline"
                    className={`h-12 flex flex-col gap-1 ${
                      customHabit.theme.color === theme.color ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setCustomHabit(prev => ({ 
                      ...prev, 
                      theme: { color: theme.color, accent: theme.accent, icon: theme.icon }
                    }))}
                  >
                    <span className="text-lg">{theme.icon}</span>
                    <span className="text-xs">{theme.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <Label>Frequency</Label>
              <Select 
                value={customHabit.recurrence.frequency} 
                onValueChange={(value: 'daily' | 'weekly' | 'custom') => 
                  setCustomHabit(prev => ({ 
                    ...prev, 
                    recurrence: { ...prev.recurrence, frequency: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Daily
                    </div>
                  </SelectItem>
                  <SelectItem value="weekly">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Weekly
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Custom
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target */}
            <div>
              <Label>Daily/Weekly Target</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  value={customHabit.recurrence.target?.value || 1}
                  onChange={(e) => setCustomHabit(prev => ({ 
                    ...prev, 
                    recurrence: { 
                      ...prev.recurrence, 
                      target: { ...prev.recurrence.target!, value: parseInt(e.target.value) || 1 }
                    }
                  }))}
                  placeholder="1"
                  className="w-20"
                />
                <Input
                  value={customHabit.recurrence.target?.unit || 'times'}
                  onChange={(e) => setCustomHabit(prev => ({ 
                    ...prev, 
                    recurrence: { 
                      ...prev.recurrence, 
                      target: { ...prev.recurrence.target!, unit: e.target.value }
                    }
                  }))}
                  placeholder="times, minutes, km, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} className="flex-1">
              Create Habit
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}