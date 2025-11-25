'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GymWorkoutTracker } from '@/components/gym-workout-tracker';
import { WorkoutTemplates } from '@/components/workout-templates';
import { GymAnalytics } from '@/components/gym-analytics';
import { CustomWorkoutBuilder } from '@/components/custom-workout-builder';
import { Dumbbell, TrendingUp, Calendar, Plus } from 'lucide-react';

interface EnhancedGymDialogProps {
  habit: any;
  entries: any[];
  onLogEntry: (habitId: string, data: any, notes?: string) => void;
  onSaveCustomTemplate?: (template: any) => void;
  trigger?: React.ReactNode;
}

export function EnhancedGymDialog({ habit, entries, onLogEntry, onSaveCustomTemplate, trigger }: EnhancedGymDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workout');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const handleSaveCustomTemplate = (template: any) => {
    if (onSaveCustomTemplate) {
      onSaveCustomTemplate(template);
    }
    setShowCustomBuilder(false);
  };

  const handleSelectTemplate = (template: any) => {
    // Convert template to exercise format for the workout tracker
    const exercises = template.exercises.map((ex: any, index: number) => ({
      id: index.toString(),
      name: ex.name,
      sets: Array.from({ length: ex.sets }, () => ({
        reps: parseInt(ex.reps.split('-')[0]) || 10,
        weight: 135, // Default starting weight
        completed: false
      })),
      restTime: 90 // Default rest time
    }));
    
    // This would update the workout tracker with the selected template
    setActiveTab('workout');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            Gym Workout Center
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'custom') {
            setShowCustomBuilder(true);
          }
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Active Workout
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Custom Builder
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-6">
            <GymWorkoutTracker 
              habit={habit}
              onLogEntry={onLogEntry}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                setShowCustomBuilder(true);
                setActiveTab('custom');
              }}>
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">Custom Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your own weekly workout plan with custom exercises and reps
                  </p>
                </CardContent>
              </Card>
            </div>
            <WorkoutTemplates onSelectTemplate={handleSelectTemplate} />
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <CustomWorkoutBuilder
              onSaveTemplate={handleSaveCustomTemplate}
              onCancel={() => {
                setShowCustomBuilder(false);
                setActiveTab('templates');
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <GymAnalytics 
              habit={habit}
              entries={entries}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}