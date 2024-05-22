import { PrismaClient } from '@prisma/client'
import { HABIT_NAMES } from './seedHabits'

async function seedValidation(prisma: PrismaClient) {
  const validation = [
    ////////////
    // Victor //
    ////////////
    {
      // Keep this one as first validation for like seeding
      validatedAt: '2024-02-10T16:20:00.000Z',
      difficulty: 1,
      message: 'Call to girlfriend instead of working on the startup, 1 hour of talking',
      habitId: HABIT_NAMES.callGirlfriend.id,
    },

    ////////////
    // Cedric //
    ////////////

    // pull ups
    {
      validatedAt: '2024-05-02T16:30:00.000Z',
      difficulty: 4,
      message: 'Getting back to the Gym after 2 weeks off, not bad but a bit hard',
      habitId: HABIT_NAMES.pullUps.id,
    },
    {
      validatedAt: '2024-07-02T16:00:00.000Z',
      difficulty: 3,
      message: 'Feeling sore from last workout, but more energy, more pullups achieved',
      habitId: HABIT_NAMES.pullUps.id,
    },
    {
      validatedAt: '2024-09-02T15:45:00.000Z',
      difficulty: 2,
      message: 'Nice workout, 100 reps achieved',
      habitId: HABIT_NAMES.pullUps.id,
    },
    // protein shake
    {
      validatedAt: '2024-02-05T09:00:00.000Z',
      difficulty: 1,
      message: 'Chocolate whey shake - very good',
      habitId: HABIT_NAMES.proteinShake.id,
    },
    {
      validatedAt: '2024-02-06T09:30:00.000Z',
      difficulty: 1,
      message: 'Vanilla whey shake - excellent',
      habitId: HABIT_NAMES.proteinShake.id,
    },
    {
      validatedAt: '2024-02-07T09:15:00.000Z',
      difficulty: 1,
      message: 'Strawberry whey shake - as good as chicken soupe',
      habitId: HABIT_NAMES.proteinShake.id,
    },
    {
      validatedAt: '2024-02-08T09:45:00.000Z',
      difficulty: 1,
      message: 'Banana whey shake - banana candy taste',
      habitId: HABIT_NAMES.proteinShake.id,
    },
    {
      validatedAt: '2024-02-09T09:20:00.000Z',
      difficulty: 1,
      message: 'Cookies and Cream whey shake - why?',
      habitId: HABIT_NAMES.proteinShake.id,
    },
    {
      validatedAt: '2024-02-10T09:55:00.000Z',
      difficulty: 1,
      message: 'Green Tea whey shake - sugar with a bit of tea',
      habitId: HABIT_NAMES.proteinShake.id,
    },
    {
      validatedAt: '2024-02-11T09:10:00.000Z',
      difficulty: 1,
      message: 'Peanut Butter whey shake - bulk taste',
      habitId: HABIT_NAMES.proteinShake.id,
    },
  ]

  for (const v of validation) {
    await prisma.validation.create({
      data: v,
    })
  }

  console.log(`${validation.length} validation created.`)
}

export { seedValidation }
