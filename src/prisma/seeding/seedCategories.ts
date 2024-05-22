import { PrismaClient } from '@prisma/client'

const NAMES = {
  sport: { id: 1, name: 'Sport' },
  nutrition: { id: 2, name: 'Nutrition' },
  study: { id: 3, name: 'Study' },
  work: { id: 4, name: 'Work' },
  family: { id: 5, name: 'Family' },
}

async function seedCategories(prisma: PrismaClient) {
  const categories = [
    {
      name: NAMES.sport.name,
    },
    {
      name: NAMES.nutrition.name,
    },
    {
      name: NAMES.study.name,
    },
    {
      name: NAMES.work.name,
    },
    {
      name: NAMES.family.name,
    },
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    })
  }

  console.log(`${categories.length} categories created.`)
}

export { seedCategories, NAMES as CATEGORY_NAMES }
