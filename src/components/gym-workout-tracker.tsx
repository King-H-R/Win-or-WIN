'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dumbbell, 
  Clock, 
  TrendingUp, 
  Plus, 
  Minus, 
  Play, 
  Pause,
  RotateCcw,
  Flame,
  Target
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    completed: boolean;
  }>;
  restTime: number;
  notes?: string;
}

interface GymWorkoutTrackerProps {
  habit: any;
  onLogEntry: (habitId: string, data: any, notes?: string) => void;
}

export function GymWorkoutTracker({ habit, onLogEntry }: GymWorkoutTrackerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Bench Press',
      sets: [
        { reps: 12, weight: 135, completed: false },
        { reps: 10, weight: 155, completed: false },
        { reps: 8, weight: 175, completed: false }
      ],
      restTime: 90
    },
    {
      id: '2',
      name: 'Squats',
      sets: [
        { reps: 12, weight: 185, completed: false },
        { reps: 10, weight: 205, completed: false },
        { reps: 8, weight: 225, completed: false }
      ],
      restTime: 120
    },
    {
      id: '3',
      name: 'Deadlifts',
      sets: [
        { reps: 8, weight: 225, completed: false },
        { reps: 6, weight: 245, completed: false },
        { reps: 4, weight: 265, completed: false }
      ],
      restTime: 180
    }
  ]);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);

  const currentExercise = exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];
  const completedSets = exercises.flatMap(ex => ex.sets).filter(set => set.completed).length;
  const totalSets = exercises.flatMap(ex => ex.sets).length;
  const workoutProgress = (completedSets / totalSets) * 100;

  const startWorkout = () => {
    setWorkoutStartTime(new Date());
  };

  const completeSet = () => {
    if (!currentExercise || !currentSet) return;

    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].sets[currentSetIndex].completed = true;
    setExercises(updatedExercises);

    // Calculate volume for this set
    const setVolume = currentSet.reps * currentSet.weight;
    setTotalVolume(prev => prev + setVolume);

    // Start rest timer
    if (currentExercise.restTime > 0) {
      setIsResting(true);
      setRestTimeLeft(currentExercise.restTime);
      
      const timer = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            clearInterval(timer);
            moveToNextSet();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      moveToNextSet();
    }
  };

  const moveToNextSet = () => {
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(prev => prev + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    } else {
      // Workout complete
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    const workoutData = {
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        totalVolume: ex.sets.reduce((sum, set) => sum + (set.reps * set.weight), 0)
      })),
      totalVolume,
      duration: workoutStartTime ? Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 60000) : 0,
      completedSets,
      totalSets
    };

    onLogEntry(habit.id, workoutData, `Great workout! Total volume: ${totalVolume.toLocaleString()} lbs`);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[exerciseIndex];
    
    if (!currentExercise || !currentExercise.sets || currentExercise.sets.length === 0) {
      // If no sets exist, create a default first set
      updatedExercises[exerciseIndex].sets = [{
        reps: 10,
        weight: 135,
        completed: false
      }];
    } else {
      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
      updatedExercises[exerciseIndex].sets.push({
        reps: lastSet?.reps || 10,
        weight: lastSet?.weight || 135,
        completed: false
      });
    }
    
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[exerciseIndex];
    
    // Only remove set if exercise exists and has sets
    if (currentExercise && currentExercise.sets && currentExercise.sets.length > 1) {
      updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    }
    
    setExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[exerciseIndex];
    
    // Only update if exercise and set exist
    if (currentExercise && currentExercise.sets && currentExercise.sets[setIndex]) {
      updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    }
    
    setExercises(updatedExercises);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workoutStartTime) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            Gym Workout Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-semibold mb-2">Ready to crush your workout?</h3>
            <p className="text-muted-foreground mb-6">
              Track your exercises, sets, reps, and weights with real-time progress
            </p>
            <Button 
              onClick={startWorkout}
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Workout
            </Button>
          </div>

          {/* Workout Preview */}
          <div className="space-y-4">
            <h4 className="font-medium">Today's Workout Plan</h4>
            {exercises.map((exercise, exIndex) => (
              <Card key={exercise.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">{exercise.name}</h5>
                  <Badge variant="outline">{exercise.sets.length} sets</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Set {setIndex + 1}:</span>
                      <span className="font-medium">{set.reps} reps × {set.weight} lbs</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            Active Workout
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Flame className="h-4 w-4 mr-1" />
              {totalVolume.toLocaleString()} lbs
            </Badge>
            <Button variant="outline" onClick={finishWorkout}>
              Finish Workout
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Workout Progress</span>
            <span>{completedSets}/{totalSets} sets completed</span>
          </div>
          <Progress value={workoutProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Current Exercise</TabsTrigger>
            <TabsTrigger value="overview">Workout Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {isResting ? (
              /* Rest Timer */
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="text-center py-8">
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {formatTime(restTimeLeft)}
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Rest Time</h3>
                  <p className="text-blue-600">Get ready for your next set!</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsResting(false)}
                  >
                    Skip Rest
                  </Button>
                </CardContent>
              </Card>
            ) : currentExercise && currentSet ? (
              /* Active Exercise */
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2>
                  <Badge variant="outline" className="text-lg">
                    Set {currentSetIndex + 1} of {currentExercise.sets.length}
                  </Badge>
                </div>

                <Card className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Reps</h4>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateSet(currentExerciseIndex, currentSetIndex, 'reps', currentSet.reps - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={currentSet.reps}
                          onChange={(e) => updateSet(currentExerciseIndex, currentSetIndex, 'reps', parseInt(e.target.value) || 0)}
                          className="text-center text-2xl font-bold w-20"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateSet(currentExerciseIndex, currentSetIndex, 'reps', currentSet.reps + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Weight (lbs)</h4>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateSet(currentExerciseIndex, currentSetIndex, 'weight', currentSet.weight - 5)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={currentSet.weight}
                          onChange={(e) => updateSet(currentExerciseIndex, currentSetIndex, 'weight', parseInt(e.target.value) || 0)}
                          className="text-center text-2xl font-bold w-20"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateSet(currentExerciseIndex, currentSetIndex, 'weight', currentSet.weight + 5)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-sm text-muted-foreground mb-4">
                      This set: {currentSet.reps} × {currentSet.weight} = {(currentSet.reps * currentSet.weight).toLocaleString()} lbs
                    </div>
                    <Button 
                      onClick={completeSet}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Complete Set
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-4">Workout Complete! 🎉</h3>
                <Button onClick={finishWorkout} size="lg">
                  Finish Workout
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            {exercises.map((exercise, exIndex) => (
              <Card key={exercise.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {exercise.sets.filter(s => s.completed).length}/{exercise.sets.length} sets
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addSet(exIndex)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground w-12">Set {setIndex + 1}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          disabled={set.completed}
                        />
                        <span>×</span>
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSet(exIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                          disabled={set.completed}
                        />
                        <span className="text-sm text-muted-foreground">lbs</span>
                      </div>
                      {set.completed ? (
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSet(exIndex, setIndex)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}