const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    // Check if demo user exists
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });

    if (!demoUser) {
      console.log('Creating demo user...');
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Demo User',
          preferences: {
            theme: 'light',
            notifications: true
          }
        }
      });
      console.log('Demo user created:', demoUser);
    } else {
      console.log('Demo user already exists:', demoUser);
    }

    // Check if there are any habits without valid user
    const orphanedHabits = await prisma.habit.findMany({
      where: {
        userId: {
          notIn: await prisma.user.findMany().then(users => users.map(u => u.id))
        }
      }
    });

    if (orphanedHabits.length > 0) {
      console.log('Found orphaned habits:', orphanedHabits.length);
      // Update orphaned habits to use demo user
      await prisma.habit.updateMany({
        where: {
          userId: {
            notIn: await prisma.user.findMany().then(users => users.map(u => u.id))
          }
        },
        data: {
          userId: demoUser.id
        }
      });
      console.log('Updated orphaned habits');
    }

    console.log('Database fix completed successfully');
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();