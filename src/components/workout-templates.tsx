'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dumbbell, 
  Target, 
  Zap, 
  Heart,
  Clock,
  TrendingUp
} from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  category: 'strength' | 'hypertrophy' | 'endurance' | 'beginner';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: number;
    muscleGroup: string;
  }>;
  description: string;
  goals: string[];
}

interface WorkoutTemplatesProps {
  onSelectTemplate: (template: WorkoutTemplate) => void;
}

export function WorkoutTemplates({ onSelectTemplate }: WorkoutTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: WorkoutTemplate[] = [
    {
      id: 'push-pull-legs',
      name: 'Push Pull Legs',
      category: 'strength',
      difficulty: 'intermediate',
      duration: 60,
      description: 'Classic 3-day split focusing on major muscle groups',
      goals: ['Build Strength', 'Muscle Growth', 'Balanced Development'],
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: 90, muscleGroup: 'Chest' },
        { name: 'Overhead Press', sets: 3, reps: '8-12', rest: 60, muscleGroup: 'Shoulders' },
        { name: 'Tricep Dips', sets: 3, reps: '10-15', rest: 60, muscleGroup: 'Triceps' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: 45, muscleGroup: 'Shoulders' }
      ]
    },
    {
      id: 'upper-lower',
      name: 'Upper/Lower Split',
      category: 'hypertrophy',
      difficulty: 'intermediate',
      duration: 75,
      description: '4-day split for balanced muscle development',
      goals: ['Hypertrophy', 'Strength', 'Aesthetics'],
      exercises: [
        { name: 'Squats', sets: 4, reps: '8-12', rest: 120, muscleGroup: 'Legs' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: 90, muscleGroup: 'Hamstrings' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: 90, muscleGroup: 'Quads' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: 45, muscleGroup: 'Calves' }
      ]
    },
    {
      id: 'full-body-beginner',
      name: 'Full Body Beginner',
      category: 'beginner',
      difficulty: 'beginner',
      duration: 45,
      description: 'Perfect for beginners starting their fitness journey',
      goals: ['Learn Basics', 'Build Foundation', 'Consistency'],
      exercises: [
        { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: 60, muscleGroup: 'Legs' },
        { name: 'Push-ups', sets: 3, reps: '8-12', rest: 60, muscleGroup: 'Chest' },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: 60, muscleGroup: 'Back' },
        { name: 'Planks', sets: 3, reps: '30-60 sec', rest: 45, muscleGroup: 'Core' }
      ]
    },
    {
      id: 'powerbuilding',
      name: 'Powerbuilding',
      category: 'strength',
      difficulty: 'advanced',
      duration: 90,
      description: 'Combine powerlifting and bodybuilding for maximum results',
      goals: ['Max Strength', 'Muscle Mass', 'Athletic Performance'],
      exercises: [
        { name: 'Deadlifts', sets: 5, reps: '3-5', rest: 180, muscleGroup: 'Full Body' },
        { name: 'Bench Press', sets: 5, reps: '3-5', rest: 150, muscleGroup: 'Chest' },
        { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: 120, muscleGroup: 'Back' },
        { name: 'Overhead Press', sets: 4, reps: '5-8', rest: 120, muscleGroup: 'Shoulders' }
      ]
    },
    {
      id: 'hiit-strength',
      name: 'HIIT Strength',
      category: 'endurance',
      difficulty: 'intermediate',
      duration: 30,
      description: 'High-intensity interval training with strength exercises',
      goals: ['Fat Loss', 'Cardio', 'Muscle Endurance'],
      exercises: [
        { name: 'Kettlebell Swings', sets: 5, reps: '20', rest: 30, muscleGroup: 'Full Body' },
        { name: 'Burpees', sets: 4, reps: '10-15', rest: 45, muscleGroup: 'Full Body' },
        { name: 'Mountain Climbers', sets: 4, reps: '30 sec', rest: 30, muscleGroup: 'Core' },
        { name: 'Jump Squats', sets: 4, reps: '15-20', rest: 45, muscleGroup: 'Legs' }
      ]
    },
    {
      id: 'bodybuilding-split',
      name: 'Bodybuilding Split',
      category: 'hypertrophy',
      difficulty: 'advanced',
      duration: 80,
      description: 'Advanced split for maximum muscle hypertrophy',
      goals: ['Muscle Growth', 'Aesthetics', 'Definition'],
      exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: 90, muscleGroup: 'Chest' },
        { name: 'Cable Crossovers', sets: 3, reps: '15-20', rest: 60, muscleGroup: 'Chest' },
        { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: 60, muscleGroup: 'Chest' },
        { name: 'Pec Deck Machine', sets: 3, reps: '12-15', rest: 45, muscleGroup: 'Chest' }
      ]
    }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="h-4 w-4" />;
      case 'hypertrophy': return <Target className="h-4 w-4" />;
      case 'endurance': return <Zap className="h-4 w-4" />;
      case 'beginner': return <Heart className="h-4 w-4" />;
      default: return <Dumbbell className="h-4 w-4" />;
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'strength', name: 'Strength', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'hypertrophy', name: 'Hypertrophy', icon: <Target className="h-4 w-4" /> },
    { id: 'endurance', name: 'Endurance', icon: <Zap className="h-4 w-4" /> },
    { id: 'beginner', name: 'Beginner', icon: <Heart className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(template.category)}
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {template.duration} minutes
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Goals:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Exercise Preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Exercises ({template.exercises.length}):</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {template.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex justify-between">
                      <span>{exercise.name}</span>
                      <span>{exercise.sets} × {exercise.reps}</span>
                    </div>
                  ))}
                  {template.exercises.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{template.exercises.length - 3} more exercises
                    </div>
                  )}
                </div>
              </div>

              {/* Select Button */}
              <Button 
                className="w-full mt-4"
                onClick={() => onSelectTemplate(template)}
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}