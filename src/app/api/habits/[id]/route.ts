import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

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

    const habit = await db.habit.update({
      where: { 
        id,
        userId: demoUser.id 
      },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        theme: body.theme,
        recurrence: body.recurrence,
        metrics: body.metrics,
        isActive: body.isActive !== undefined ? body.isActive : true,
      }
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // Delete related entries and streaks first
    await db.habitEntry.deleteMany({
      where: { habitId: id }
    });

    await db.streak.deleteMany({
      where: { habitId: id }
    });

    // Delete the habit
    await db.habit.delete({
      where: { 
        id,
        userId: demoUser.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}