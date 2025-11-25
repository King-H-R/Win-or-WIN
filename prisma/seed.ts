import { PrismaClient } from '@prisma/client';
import { HABIT_TEMPLATES } from '../src/lib/types';

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  });

  console.log('Created demo user:', user);

  // Create sample habits from templates
  const habitTemplates = [
    HABIT_TEMPLATES.running,
    HABIT_TEMPLATES.study,
    HABIT_TEMPLATES.meditation
  ];

  for (const template of habitTemplates) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        title: template.title,
        description: template.description,
        type: template.type,
        theme: template.theme,
        recurrence: template.recurrence,
        metrics: template.metrics,
        isActive: true
      }
    });

    console.log('Created habit:', habit.title);

    // Create streak record
    await prisma.streak.create({
      data: {
        habitId: habit.id,
        current: Math.floor(Math.random() * 10),
        best: Math.floor(Math.random() * 20) + 5,
        lastCompleted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Create some sample entries for the last few days
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Randomly decide if this habit was completed on this day
      if (Math.random() > 0.3) {
        let entryValue: any = { completed: true };

        // Add specific metric values based on habit type
        if (template.type === 'running') {
          entryValue = {
            completed: true,
            distance: Math.random() * 10 + 2, // 2-12 km
            duration: Math.floor(Math.random() * 30 + 20), // 20-50 min
            pace: Math.floor(Math.random() * 3 + 4), // 4-7 min/km
            effort: Math.floor(Math.random() * 5 + 5) // 5-10 effort
          };
        } else if (template.type === 'study') {
          entryValue = {
            completed: true,
            duration: Math.floor(Math.random() * 60 + 30), // 30-90 min
            pomodoros: Math.floor(Math.random() * 4 + 1), // 1-5 pomodoros
            focus_quality: Math.floor(Math.random() * 4 + 6) // 6-10 quality
          };
        } else if (template.type === 'custom' && template.title === 'Meditation') {
          entryValue = {
            completed: true,
            duration: Math.floor(Math.random() * 15 + 5), // 5-20 min
            type: Math.random() > 0.5 // guided vs unguided
          };
        }

        await prisma.habitEntry.create({
          data: {
            habitId: habit.id,
            date: date,
            value: entryValue,
            completed: true,
            notes: Math.random() > 0.7 ? `Great session! Felt really focused.` : undefined
          }
        });
      }
    }

    console.log(`Created sample entries for ${template.title}`);
  }

  // Create some achievements
  const achievements = [
    {
      title: 'First Step',
      description: 'Complete your first habit entry',
      icon: '🎯',
      criteria: { type: 'first_entry' }
    },
    {
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      criteria: { type: 'streak', days: 7 }
    },
    {
      title: 'Habit Master',
      description: 'Complete 30 days of any habit',
      icon: '🏆',
      criteria: { type: 'total_days', days: 30 }
    },
    {
      title: 'Early Bird',
      description: 'Complete 5 habits before 8 AM',
      icon: '🌅',
      criteria: { type: 'early_completion', count: 5 }
    }
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement
    });
  }

  console.log('Created achievements');

  // Award some achievements to the demo user
  const firstAchievement = await prisma.achievement.findFirst({
    where: { title: 'First Step' }
  });

  if (firstAchievement) {
    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId: firstAchievement.id
      }
    });
  }

  console.log('Seeded demo data successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });