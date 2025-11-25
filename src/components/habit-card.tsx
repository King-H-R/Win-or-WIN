'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Plus, TrendingUp, Calendar, Target, Edit, Trash2 } from 'lucide-react';
import { Habit, Streak } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit & { streak?: Streak; todayProgress?: number };
  onLogEntry: (habitId: string) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  className?: string;
}

export function HabitCard({ habit, onLogEntry, onEdit, onDelete, className }: HabitCardProps) {
  const isCompletedToday = habit.todayProgress === 100;
  const progressPercentage = habit.todayProgress || 0;

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-lg',
        isCompletedToday && 'ring-2 ring-green-500',
        className
      )}
    >
      {/* Theme header */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: habit.theme.color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: habit.theme.color }}
            >
              <span className="text-lg">{habit.theme.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground">{habit.description}</p>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(habit.id)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(habit.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={() => onLogEntry(habit.id)}
              className={cn(
                'h-8 w-8 p-0',
                isCompletedToday 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'hover:scale-105',
                !isCompletedToday && 'shadow-sm'
              )}
              style={{ 
                backgroundColor: isCompletedToday ? undefined : habit.theme.color 
              }}
            >
              {isCompletedToday ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            style={{ 
              '--progress-background': habit.theme.accent 
            } as React.CSSProperties}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center text-orange-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold">{habit.streak?.current || 0}</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center text-blue-600">
              <Target className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold">{habit.streak?.best || 0}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center text-purple-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold">
              {habit.recurrence.days?.length || 7}
            </div>
            <div className="text-xs text-muted-foreground">This week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}