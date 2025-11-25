'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Plus, Timer, TrendingUp } from 'lucide-react';
import { Habit, HabitMetric } from '@/lib/types';

interface LogEntryDialogProps {
  habit: Habit;
  onLogEntry: (habitId: string, data: Record<string, any>, notes?: string) => void;
  trigger?: React.ReactNode;
}

export function LogEntryDialog({ habit, onLogEntry, trigger }: LogEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [entryData, setEntryData] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMetricChange = (metric: HabitMetric, value: any) => {
    setEntryData(prev => ({ ...prev, [metric.name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Set completed to true if any metric has a value
      const hasValue = Object.values(entryData).some(value => 
        value !== undefined && value !== null && value !== ''
      );
      
      onLogEntry(habit.id, { ...entryData, completed: hasValue }, notes);
      setOpen(false);
      setEntryData({});
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMetricInput = (metric: HabitMetric) => {
    const value = entryData[metric.name];

    switch (metric.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => handleMetricChange(metric, checked)}
            />
            <Label>{metric.name}</Label>
          </div>
        );

      case 'counter':
        return (
          <div className="space-y-2">
            <Label>{metric.name}</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetricChange(metric, Math.max(0, (value || 0) - 1))}
              >
                -
              </Button>
              <Input
                type="number"
                value={value || 0}
                onChange={(e) => handleMetricChange(metric, parseInt(e.target.value) || 0)}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetricChange(metric, (value || 0) + 1)}
              >
                +
              </Button>
              {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
            </div>
          </div>
        );

      case 'timer':
        return (
          <div className="space-y-2">
            <Label>{metric.name}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={value || ''}
                onChange={(e) => handleMetricChange(metric, parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-24"
              />
              {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
            </div>
          </div>
        );

      case 'numeric':
        return (
          <div className="space-y-2">
            <Label>{metric.name}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                value={value || ''}
                onChange={(e) => handleMetricChange(metric, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-24"
              />
              {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
            </div>
          </div>
        );

      case 'distance':
        return (
          <div className="space-y-2">
            <Label>{metric.name}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                value={value || ''}
                onChange={(e) => handleMetricChange(metric, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-24"
              />
              {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const requiredMetrics = habit.metrics.filter(m => m.required);
  const optionalMetrics = habit.metrics.filter(m => !m.required);
  const canSubmit = requiredMetrics.every(m => entryData[m.name] !== undefined && entryData[m.name] !== '');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: habit.theme.color }}
            >
              <span>{habit.theme.icon}</span>
            </div>
            Log Entry: {habit.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Required Metrics */}
          {requiredMetrics.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requiredMetrics.map(metric => (
                  <div key={metric.name}>
                    {renderMetricInput(metric)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Optional Metrics */}
          {optionalMetrics.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Optional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {optionalMetrics.map(metric => (
                  <div key={metric.name}>
                    {renderMetricInput(metric)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go? Any thoughts or observations..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={!canSubmit || isSubmitting}
              className="flex-1"
              style={{ backgroundColor: habit.theme.color }}
            >
              {isSubmitting ? 'Saving...' : 'Log Entry'}
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