import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: [
      'Habit Tracking',
      'Workout Planning',
      'Progress Analytics',
      'Achievement System',
      'Calendar Heatmap',
      'Gym Workout Tracker',
      'Exercise Templates'
    ],
    endpoints: {
      habits: '/api/habits',
      entries: '/api/entries',
      achievements: '/api/achievements'
    }
  });
}