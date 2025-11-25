import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // For demo purposes, create or get the demo user
    let demoUser = await db.user.findUnique({
      where: { email: 'demo@example.com' }
    });

    if (!demoUser) {
      demoUser = await db.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Demo User',
          preferences: {
            theme: 'light',
            notifications: true
          }
        }
      });
    }

    const [allAchievements, userAchievements] = await Promise.all([
      db.achievement.findMany({
        orderBy: { createdAt: 'asc' }
      }),
      db.userAchievement.findMany({
        where: { userId: demoUser.id },
        include: {
          achievement: true
        }
      })
    ]);

    // Combine achievements with earned status
    const achievementsWithStatus = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      return {
        ...achievement,
        earnedAt: userAchievement?.earnedAt
      };
    });

    // Calculate user stats
    const totalPoints = userAchievements.length * 50; // 50 points per achievement
    const level = Math.floor(totalPoints / 100) + 1;

    return NextResponse.json({
      achievements: achievementsWithStatus,
      totalPoints,
      level
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}