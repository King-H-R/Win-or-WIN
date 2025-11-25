'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Trophy,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface GymAnalyticsProps {
  habit: any;
  entries: any[];
}

export function GymAnalytics({ habit, entries }: GymAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Process data for charts
  const processVolumeData = () => {
    const data = entries.map(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const exercises = entry.value?.exercises || [];
      const totalVolume = exercises.reduce((sum: number, ex: any) => sum + (ex.totalVolume || 0), 0);
      const completedSets = exercises.reduce((sum: number, ex: any) => sum + (ex.completedSets || 0), 0);
      
      return {
        date,
        volume: totalVolume,
        sets: completedSets,
        duration: entry.value?.duration || 0
      };
    }).reverse();

    return data;
  };

  const processExerciseProgress = () => {
    const exerciseData: Record<string, any[]> = {};
    
    entries.forEach(entry => {
      const exercises = entry.value?.exercises || [];
      exercises.forEach((ex: any) => {
        if (!exerciseData[ex.name]) {
          exerciseData[ex.name] = [];
        }
        
        const bestSet = ex.sets?.reduce((best: any, set: any) => {
          const volume = set.reps * set.weight;
          const bestVolume = best.reps * best.weight;
          return volume > bestVolume ? set : best;
        }, ex.sets[0] || {});
        
        exerciseData[ex.name].push({
          date: new Date(entry.date).toLocaleDateString(),
          weight: bestSet.weight || 0,
          reps: bestSet.reps || 0,
          volume: bestSet.reps * bestSet.weight
        });
      });
    });

    return Object.entries(exerciseData).map(([name, data]) => ({ name, data }));
  };

  const volumeData = processVolumeData();
  const exerciseProgress = processExerciseProgress();

  // Calculate stats
  const totalWorkouts = entries.length;
  const totalVolume = volumeData.reduce((sum, day) => sum + day.volume, 0);
  const avgVolumePerWorkout = totalWorkouts > 0 ? totalVolume / totalWorkouts : 0;
  const totalDuration = volumeData.reduce((sum, day) => sum + day.duration, 0);
  const bestWorkout = volumeData.reduce((best, day) => day.volume > best.volume ? day : best, { volume: 0 });

  const getRecentPRs = () => {
    const prs: any[] = [];
    
    exerciseProgress.forEach(exercise => {
      if (exercise.data.length > 0) {
        const recent = exercise.data[exercise.data.length - 1];
        const previous = exercise.data[exercise.data.length - 2];
        
        if (recent && (!previous || recent.weight > previous.weight)) {
          prs.push({
            exercise: exercise.name,
            weight: recent.weight,
            reps: recent.reps,
            date: recent.date
          });
        }
      }
    });

    return prs;
  };

  const recentPRs = getRecentPRs();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">gym sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">pounds lifted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgVolumePerWorkout)}</div>
            <p className="text-xs text-muted-foreground">lbs per workout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Workout</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(bestWorkout.volume / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">personal record</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Personal Records */}
      {recentPRs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Recent Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPRs.map((pr, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-yellow-50 border-yellow-200">
                  <div className="text-yellow-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900">{pr.exercise}</h4>
                    <p className="text-sm text-yellow-700">{pr.weight} lbs × {pr.reps} reps</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    PR!
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Tabs defaultValue="volume" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volume">Volume Progress</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle>Workout Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} lbs`, 'Volume']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises">
          <div className="space-y-6">
            {exerciseProgress.map((exercise) => (
              <Card key={exercise.name}>
                <CardHeader>
                  <CardTitle>{exercise.name} Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={exercise.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'weight' ? `${value} lbs` : value,
                          name === 'weight' ? 'Weight' : 'Reps'
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="weight"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="reps" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="reps"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}