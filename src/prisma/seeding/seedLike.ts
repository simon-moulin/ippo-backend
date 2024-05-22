import { PrismaClient } from '@prisma/client'
import { USERNAMES } from './seedUsers'

async function seedLike(prisma: PrismaClient) {
  const likes = [
    // everybody likes Victor validation of talking to girlfriend
    {
      validationId: 1, // id 1 should be the validation of talking to girlfriend
      userId: USERNAMES.cedric.id,
    },
    {
      validationId: 1,
      userId: USERNAMES.adrien.id,
    },
    {
      validationId: 1,
      userId: USERNAMES.simon.id,
    },
    {
      validationId: 1,
      userId: USERNAMES.victor.id, // Like its own validation
    },
    // likes of pull ups validation
    {
      validationId: 2, // id 2 should be the first validation of pull ups
      userId: USERNAMES.cedric.id,
    },
    {
      validationId: 2,
      userId: USERNAMES.adrien.id,
    },
    {
      validationId: 2,
      userId: USERNAMES.simon.id,
    },
    {
      validationId: 2,
      userId: USERNAMES.victor.id,
    },
    // second validation
    {
      validationId: 3,
      userId: USERNAMES.adrien.id,
    },
    {
      validationId: 3,
      userId: USERNAMES.victor.id,
    },
    // third validation
    {
      validationId: 4,
      userId: USERNAMES.victor.id,
    },
  ]

  for (const like of likes) {
    await prisma.like.create({
      data: like,
    })
  }

  console.log(`${likes.length} likes created.`)
}

export { seedLike }
