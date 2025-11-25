'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  earnedAt?: string;
}

interface AchievementsPanelProps {
  achievements: Achievement[];
  totalPoints?: number;
  level?: number;
}

export function AchievementsPanel({ achievements, totalPoints = 0, level = 1 }: AchievementsPanelProps) {
  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const availableAchievements = achievements.filter(a => !a.earnedAt);

  const getIcon = (icon?: string) => {
    switch (icon) {
      case '🎯': return <Target className="h-6 w-6" />;
      case '🔥': return <Zap className="h-6 w-6" />;
      case '🏆': return <Trophy className="h-6 w-6" />;
      case '🌅': return <Star className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{earnedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Earned Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200"
                >
                  <div className="text-green-600">
                    {getIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">{achievement.title}</h4>
                    <p className="text-sm text-green-700">{achievement.description}</p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ Earned
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Achievements */}
      {availableAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Available Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-200 opacity-75"
                >
                  <div className="text-gray-500">
                    {getIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-700">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className="text-gray-500">
                    🔒 Locked
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress to Next Level */}
      <Card>
        <CardHeader>
          <CardTitle>Progress to Level {level + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {level}</span>
              <span>{totalPoints} / {level * 100} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalPoints / (level * 100)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}