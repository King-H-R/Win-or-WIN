'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface CalendarHeatmapProps {
  data: Record<string, number>; // date string -> completion percentage
  month: Date;
  className?: string;
}

export function CalendarHeatmap({ data, month, className }: CalendarHeatmapProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getIntensity = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const value = data[dateStr] || 0;
    
    if (value === 0) return 'bg-gray-100';
    if (value < 25) return 'bg-green-200';
    if (value < 50) return 'bg-green-300';
    if (value < 75) return 'bg-green-400';
    return 'bg-green-500';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          {format(month, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days of the month */}
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const value = data[dateStr] || 0;
              const isCurrentMonth = isSameMonth(day, month);
              const isCurrentDay = isToday(day);
              
              return (
                <div
                  key={dateStr}
                  className={cn(
                    'aspect-square rounded-sm flex items-center justify-center text-xs cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-offset-1',
                    getIntensity(day),
                    !isCurrentMonth && 'opacity-30',
                    isCurrentDay && 'ring-2 ring-blue-500 ring-offset-1'
                  )}
                  title={`${format(day, 'MMM d, yyyy')}: ${value}% complete`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm" />
              <div className="w-3 h-3 bg-green-200 rounded-sm" />
              <div className="w-3 h-3 bg-green-300 rounded-sm" />
              <div className="w-3 h-3 bg-green-400 rounded-sm" />
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}