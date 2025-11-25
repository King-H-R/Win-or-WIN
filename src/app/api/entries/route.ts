import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { format, startOfDay, isToday } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { habitId, value, notes } = body;

    // Check if entry already exists for today
    const today = startOfDay(new Date());
    const existingEntry = await db.habitEntry.findFirst({
      where: {
        habitId,
        date: today
      }
    });

    if (existingEntry) {
      // Update existing entry
      const updatedEntry = await db.habitEntry.update({
        where: { id: existingEntry.id },
        data: {
          value,
          notes,
          completed: true
        }
      });

      // Update streak
      await updateStreak(habitId);
      
      return NextResponse.json(updatedEntry);
    } else {
      // Create new entry
      const entry = await db.habitEntry.create({
        data: {
          habitId,
          date: today,
          value,
          notes,
          completed: true
        }
      });

      // Update streak
      await updateStreak(habitId);
      
      return NextResponse.json(entry, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating habit entry:', error);
    return NextResponse.json({ error: 'Failed to create habit entry' }, { status: 500 });
  }
}

async function updateStreak(habitId: string) {
  const streak = await db.streak.findUnique({
    where: { habitId }
  });

  if (!streak) {
    // Create new streak
    await db.streak.create({
      data: {
        habitId,
        current: 1,
        best: 1,
        lastCompleted: new Date()
      }
    });
    return;
  }

  const today = startOfDay(new Date());
  const lastCompleted = streak.lastCompleted ? startOfDay(new Date(streak.lastCompleted)) : null;
  
  // Check if last completed was yesterday (to continue streak)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newCurrent = 1;
  
  if (lastCompleted && (isToday(lastCompleted) || lastCompleted.getTime() === yesterday.getTime())) {
    // Continue or maintain streak
    newCurrent = isToday(lastCompleted) ? streak.current : streak.current + 1;
  }

  const newBest = Math.max(newCurrent, streak.best);

  await db.streak.update({
    where: { id: streak.id },
    data: {
      current: newCurrent,
      best: newBest,
      lastCompleted: today
    }
  });
}