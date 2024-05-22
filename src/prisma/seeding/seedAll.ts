import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { seedUsers } from './seedUsers'
import { seedCategories } from './seedCategories'
import { seedHabits } from './seedHabits'
import { seedFollow } from './seedFollows'
import { seedValidation } from './seedValidation'
import { seedLike } from './seedLike'

async function main() {
  console.log('Seeding users...')
  await seedUsers(prisma)

  console.log('Seeding categories...')
  await seedCategories(prisma)

  console.log('Seeding habits...')
  await seedHabits(prisma)

  console.log('Seeding follows...')
  await seedFollow(prisma)

  console.log('Seeding validation...')
  await seedValidation(prisma)

  console.log('Seeding likes...')
  await seedLike(prisma)

  console.log('All seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
