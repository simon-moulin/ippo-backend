import { Frequency, PrismaClient } from '@prisma/client'
import { USERNAMES } from './seedUsers'
import { CATEGORY_NAMES } from './seedCategories'

const NAMES = {
  pullUps: { id: 1, name: 'pull-ups' },
  proteinShake: { id: 2, name: 'Protein shake' },
  finishReadingABook: { id: 3, name: 'Finish reading a book' },
  workOnStartup: { id: 4, name: 'Work on startup' },
  callGirlfriend: { id: 5, name: 'Call girlfriend' },
}

async function seedHabits(prisma: PrismaClient) {
  const habits = [
    ////////////
    // CEDRIC //
    ////////////
    {
      name: NAMES.pullUps.name,
      categoryId: CATEGORY_NAMES.sport.id,
      userId: USERNAMES.cedric.id,
      frequency: Frequency.WEEKLY,
      occurency: 3,
    },
    {
      name: NAMES.proteinShake.name,
      categoryId: CATEGORY_NAMES.nutrition.id,
      userId: USERNAMES.cedric.id,
      frequency: Frequency.DAILY,
      occurency: 2,
    },

    ////////////
    // ADRIEN //
    ////////////
    {
      name: NAMES.finishReadingABook.name,
      categoryId: CATEGORY_NAMES.study.id,
      userId: USERNAMES.adrien.id,
      frequency: Frequency.MONTHLY,
      occurency: 1,
    },

    ////////////
    //  SIMON //
    ////////////
    {
      name: NAMES.workOnStartup.name,
      categoryId: CATEGORY_NAMES.work.id,
      userId: USERNAMES.simon.id,
      frequency: Frequency.WEEKLY,
      occurency: 5,
    },

    ////////////
    // VICTOR //
    ////////////
    {
      name: NAMES.callGirlfriend.name,
      categoryId: CATEGORY_NAMES.family.id,
      userId: USERNAMES.victor.id,
      frequency: Frequency.DAILY,
      occurency: 1,
    },
  ]

  for (const habit of habits) {
    await prisma.habit.create({
      data: habit,
    })
  }

  console.log(`${habits.length} habits created.`)
}

export { seedHabits, NAMES as HABIT_NAMES }
