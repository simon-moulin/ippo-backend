import { PrismaClient } from '@prisma/client'

// array of username, to have the id number
const USERNAMES = {
  cedric: { id: 1, name: 'cedric' },
  adrien: { id: 2, name: 'adrien' },
  simon: { id: 3, name: 'simon' },
  victor: { id: 4, name: 'victor' },
  testUser: { id: 5, name: 'testUser' },
}

async function seedUsers(prisma: PrismaClient) {
  const users = [
    {
      username: USERNAMES.cedric.name,
      email: 'cedric@example.com',
      password: '$2b$12$rvyslldLsbEGuQ7MOz0WAOztwfBaBEgTtRqWplmhrcriA5cAuGxO6',
      imageUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      username: USERNAMES.adrien.name,
      email: 'adrien@example.com',
      password: '$2b$12$rvyslldLsbEGuQ7MOz0WAOztwfBaBEgTtRqWplmhrcriA5cAuGxO6',
      imageUrl: 'https://randomuser.me/api/portraits/men/47.jpg',
    },
    {
      username: USERNAMES.simon.name,
      email: 'simon@example.com',
      password: '$2b$12$rvyslldLsbEGuQ7MOz0WAOztwfBaBEgTtRqWplmhrcriA5cAuGxO6',
      imageUrl: 'https://randomuser.me/api/portraits/men/48.jpg',
    },
    {
      username: USERNAMES.victor.name,
      email: 'victor@example.com',
      password: '$2b$12$rvyslldLsbEGuQ7MOz0WAOztwfBaBEgTtRqWplmhrcriA5cAuGxO6',
      imageUrl: 'https://randomuser.me/api/portraits/men/49.jpg',
    },
    {
      // This user has no table associated with it, no habits, no follows, etc.
      username: USERNAMES.testUser.name,
      email: 'test@example.com',
      password: '$2b$12$rvyslldLsbEGuQ7MOz0WAOztwfBaBEgTtRqWplmhrcriA5cAuGxO6',
      imageUrl: 'https://randomuser.me/api/portraits/men/50.jpg',
    },
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user,
    })
  }

  console.log(`${users.length} users created.`)
}

export { seedUsers, USERNAMES }
