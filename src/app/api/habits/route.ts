import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const habits = await db.habit.findMany({
      include: {
        streaks: true,
        entries: {
          orderBy: {
            date: 'desc'
          },
          take: 50
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, theme, recurrence, metrics, userId } = body;

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

    const habit = await db.habit.create({
      data: {
        title,
        description,
        type,
        theme,
        recurrence,
        metrics,
        userId: userId || demoUser.id,
      },
      include: {
        streaks: true
      }
    });

    // Create initial streak record
    await db.streak.create({
      data: {
        habitId: habit.id,
        current: 0,
        best: 0,
      }
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}