'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Dumbbell, 
  Target,
  Save,
  Edit
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  notes?: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'hypertrophy' | 'endurance' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  weeklyPlan: {
    monday: Exercise[];
    tuesday: Exercise[];
    wednesday: Exercise[];
    thursday: Exercise[];
    friday: Exercise[];
    saturday: Exercise[];
    sunday: Exercise[];
  };
  createdAt: string;
}

interface CustomWorkoutBuilderProps {
  onSaveTemplate: (template: WorkoutTemplate) => void;
  onCancel: () => void;
  initialTemplate?: WorkoutTemplate;
}

const weekDays = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' }
];

const exerciseLibrary = [
  { name: 'Bench Press', category: 'strength', muscleGroup: 'Chest' },
  { name: 'Squats', category: 'strength', muscleGroup: 'Legs' },
  { name: 'Deadlifts', category: 'strength', muscleGroup: 'Full Body' },
  { name: 'Overhead Press', category: 'strength', muscleGroup: 'Shoulders' },
  { name: 'Bent Over Rows', category: 'strength', muscleGroup: 'Back' },
  { name: 'Pull-ups', category: 'strength', muscleGroup: 'Back' },
  { name: 'Dips', category: 'strength', muscleGroup: 'Triceps' },
  { name: 'Bicep Curls', category: 'strength', muscleGroup: 'Biceps' },
  { name: 'Lunges', category: 'strength', muscleGroup: 'Legs' },
  { name: 'Plank', category: 'strength', muscleGroup: 'Core' },
  { name: 'Push-ups', category: 'endurance', muscleGroup: 'Full Body' },
  { name: 'Burpees', category: 'endurance', muscleGroup: 'Full Body' },
  { name: 'Mountain Climbers', category: 'endurance', muscleGroup: 'Core' },
  { name: 'Jumping Jacks', category: 'endurance', muscleGroup: 'Full Body' },
  { name: 'Dumbbell Flyes', category: 'hypertrophy', muscleGroup: 'Chest' },
  { name: 'Incline Press', category: 'hypertrophy', muscleGroup: 'Chest' },
  { name: 'Leg Press', category: 'hypertrophy', muscleGroup: 'Legs' },
  { name: 'Hammer Curls', category: 'hypertrophy', muscleGroup: 'Biceps' },
  { name: 'Tricep Pushdowns', category: 'hypertrophy', muscleGroup: 'Triceps' },
  { name: 'Lateral Raises', category: 'hypertrophy', muscleGroup: 'Shoulders' },
  { name: 'Face Pulls', category: 'hypertrophy', muscleGroup: 'Back' },
  { name: 'Romanian Deadlifts', category: 'hypertrophy', muscleGroup: 'Hamstrings' }
];

export function CustomWorkoutBuilder({ onSaveTemplate, onCancel, initialTemplate }: CustomWorkoutBuilderProps) {
  const [template, setTemplate] = useState<WorkoutTemplate>(
    initialTemplate || {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: 'custom',
      difficulty: 'intermediate',
      weeklyPlan: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      createdAt: new Date().toISOString()
    }
  );

  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');

  const addExercise = (dayKey: string, exercise: Exercise) => {
    setTemplate(prev => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [dayKey]: [...prev.weeklyPlan[dayKey as keyof typeof prev.weeklyPlan], exercise]
      }
    }));
  };

  const removeExercise = (dayKey: string, exerciseIndex: number) => {
    setTemplate(prev => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [dayKey]: prev.weeklyPlan[dayKey as keyof typeof prev.weeklyPlan].filter((_, index) => index !== exerciseIndex)
      }
    }));
  };

  const updateExercise = (dayKey: string, exerciseIndex: number, field: keyof Exercise, value: any) => {
    setTemplate(prev => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [dayKey]: prev.weeklyPlan[dayKey as keyof typeof prev.weeklyPlan].map((exercise, index) =>
          index === exerciseIndex ? { ...exercise, [field]: value } : exercise
        )
      }
    }));
  };

  const addExerciseFromLibrary = (exercise: typeof exerciseLibrary[0]) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exercise.name,
      sets: 3,
      reps: 10,
      weight: 135,
      restTime: 90,
      notes: ''
    };
    addExercise(selectedDay, newExercise);
    setShowExerciseLibrary(false);
  };

  const addCustomExercise = () => {
    if (!customExerciseName.trim()) {
      alert('Please enter an exercise name');
      return;
    }
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: customExerciseName.trim(),
      sets: 3,
      reps: 10,
      weight: 135,
      restTime: 90,
      notes: ''
    };
    addExercise(selectedDay, newExercise);
    setCustomExerciseName('');
    // Clear the input field after adding
    const inputElement = document.querySelector('input[placeholder="Type custom exercise name..."]') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  };

  const copyDayToOtherDays = (fromDay: string) => {
    const exercisesToCopy = template.weeklyPlan[fromDay as keyof typeof template.weeklyPlan];
    const otherDays = weekDays.filter(d => d.key !== fromDay);
    
    setTemplate(prev => {
      const newPlan = { ...prev.weeklyPlan };
      otherDays.forEach(day => {
        newPlan[day.key as keyof typeof newPlan] = exercisesToCopy.map(exercise => ({
          ...exercise,
          id: Date.now().toString() + Math.random()
        }));
      });
      return { ...prev, weeklyPlan: newPlan };
    });
  };

  const getDayTotal = (dayKey: string) => {
    const exercises = template.weeklyPlan[dayKey as keyof typeof template.weeklyPlan];
    return exercises.reduce((total, exercise) => total + (exercise.sets * exercise.reps), 0);
  };

  const getDayVolume = (dayKey: string) => {
    const exercises = template.weeklyPlan[dayKey as keyof typeof template.weeklyPlan];
    return exercises.reduce((total, exercise) => total + (exercise.sets * exercise.reps * exercise.weight), 0);
  };

  const saveTemplate = () => {
    console.log('Save template called with:', template);
    if (!template.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    console.log('Calling onSaveTemplate with template:', template);
    onSaveTemplate(template);
    setShowExerciseLibrary(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          Custom Workout Template Builder
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={saveTemplate} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Template Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={template.name}
            onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Weekly Push/Pull/Legs Split"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-description">Description</Label>
          <Input
            id="template-description"
            value={template.description}
            onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your workout routine"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-difficulty">Difficulty</Label>
          <Select value={template.difficulty} onValueChange={(value: any) => setTemplate(prev => ({ ...prev, difficulty: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Week Day Selector */}
      <div className="space-y-4">
        <Label>Select Day to Edit</Label>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {weekDays.map(day => (
            <Button
              key={day.key}
              variant={selectedDay === day.key ? "default" : "outline"}
              onClick={() => setSelectedDay(day.key)}
              className="flex flex-col items-center gap-1 h-16"
            >
              <div className="font-medium">{day.short}</div>
              <div className="text-xs">
                {template.weeklyPlan[day.key as keyof typeof template.weeklyPlan].length} exercises
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise Builder for Selected Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {weekDays.find(d => d.key === selectedDay)?.label} Workout
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExerciseLibrary(true)}
              className="flex items-center gap-2"
            >
              <Dumbbell className="h-4 w-4" />
              Exercise Library
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyDayToOtherDays(selectedDay)}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Copy to All Days
            </Button>
          </div>
        </div>

        {/* Add Custom Exercise Section */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold">Add Custom Exercise</h4>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type custom exercise name..."
                value={customExerciseName}
                onChange={(e) => setCustomExerciseName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomExercise();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={addCustomExercise} disabled={!customExerciseName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Create your own exercises by typing a name and clicking "Add Exercise"
            </p>
          </CardContent>
        </Card>

        {/* Day Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {template.weeklyPlan[selectedDay as keyof typeof template.weeklyPlan].length}
              </div>
              <div className="text-sm text-muted-foreground">Exercises</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {getDayTotal(selectedDay)}
              </div>
              <div className="text-sm text-muted-foreground">Total Reps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(getDayVolume(selectedDay) / 1000)}k
              </div>
              <div className="text-sm text-muted-foreground">Total Volume (lbs)</div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {template.weeklyPlan[selectedDay as keyof typeof template.weeklyPlan].length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <div className="text-6xl mb-4">💪</div>
                <h4 className="text-lg font-semibold mb-2">No exercises yet</h4>
                <p className="text-muted-foreground mb-4">
                  Add exercises from library or create custom ones
                </p>
                <div className="space-y-4">
                  <Button onClick={() => setShowExerciseLibrary(true)} className="w-full">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Browse Exercise Library
                  </Button>
                  
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Plus className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Add Custom Exercise</h4>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type custom exercise name..."
                          value={customExerciseName}
                          onChange={(e) => setCustomExerciseName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addCustomExercise();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button onClick={addCustomExercise} disabled={!customExerciseName.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Exercise
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Create your own exercises by typing a name and clicking "Add Exercise"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            template.weeklyPlan[selectedDay as keyof typeof template.weeklyPlan].map((exercise, index) => (
              <Card key={exercise.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg">{exercise.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(selectedDay, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Sets</Label>
                      <Input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(selectedDay, index, 'sets', parseInt(e.target.value) || 1)}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Reps</Label>
                      <Input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(selectedDay, index, 'reps', parseInt(e.target.value) || 1)}
                        min="1"
                        max="50"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Weight (lbs)</Label>
                      <Input
                        type="number"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(selectedDay, index, 'weight', parseInt(e.target.value) || 0)}
                        min="0"
                        max="1000"
                        step="5"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rest (sec)</Label>
                      <Input
                        type="number"
                        value={exercise.restTime}
                        onChange={(e) => updateExercise(selectedDay, index, 'restTime', parseInt(e.target.value) || 0)}
                        min="0"
                        max="300"
                        step="15"
                      />
                    </div>
                  </div>
                  
                  {exercise.notes && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      <strong>Notes:</strong> {exercise.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Exercise Library Modal */}
      {showExerciseLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercise Library</CardTitle>
              <Button variant="ghost" onClick={() => setShowExerciseLibrary(false)}>
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exerciseLibrary.map((exercise, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addExerciseFromLibrary(exercise)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-semibold mb-2">{exercise.name}</div>
                      <Badge variant="secondary" className="mb-2">
                        {exercise.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {exercise.muscleGroup}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
