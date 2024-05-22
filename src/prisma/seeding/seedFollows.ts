import { PrismaClient } from '@prisma/client'

import { USERNAMES } from './seedUsers'
async function seedFollow(prisma: PrismaClient) {
  const follow = [
    // Cedric follows others and they have accpeted the follow
    {
      followerId: USERNAMES.cedric.id,
      followingId: USERNAMES.adrien.id,
      subscribe: '2024-01-09T08:00:00.000Z',
    },
    {
      followerId: USERNAMES.cedric.id,
      // Victor is followed by others
      followingId: USERNAMES.victor.id,
      subscribe: '2024-01-09T08:00:00.000Z',
    },
    {
      followerId: USERNAMES.adrien.id,
      // Victor is followed by others
      followingId: USERNAMES.victor.id,
    },
    // Simon follow Adrien and is followed by Adrien
    {
      followerId: USERNAMES.simon.id,
      followingId: USERNAMES.adrien.id,
    },
    {
      followerId: USERNAMES.adrien.id,
      followingId: USERNAMES.simon.id,
    },
    // everyone follows cedric and has accepted the follow
    {
      followerId: USERNAMES.adrien.id,
      followingId: USERNAMES.cedric.id,
      subscribe: '2024-01-15T08:00:00.000Z',
    },
    {
      followerId: USERNAMES.simon.id,
      followingId: USERNAMES.cedric.id,
      subscribe: '2024-01-15T08:00:00.000Z',
    },
    {
      followerId: USERNAMES.victor.id,
      followingId: USERNAMES.cedric.id,
      subscribe: '2024-01-15T08:00:00.000Z',
    },
  ]

  for (const f of follow) {
    await prisma.follows.create({
      data: f,
    })
  }

  console.log(`${follow.length} follows created.`)
}

export { seedFollow }
