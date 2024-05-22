import { describe, beforeEach, expect, test, vi, afterAll, beforeAll } from 'vitest'
import express, { NextFunction } from 'express'
import request from 'supertest'
import { FollowRoute } from '@routes/follow.route'
import { AuthRoute } from '@routes/auth.route'
import { App } from '@src/app'
import 'reflect-metadata'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { seedFollow } from '@seeding/seedFollows'
import { USERNAMES } from '@seeding/seedUsers'
import { RequestWithUser } from '@src/interfaces/auth.interface'

dotenv.config({ path: '.env.test' })

async function truncateFollowsTable(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Follows" RESTART IDENTITY CASCADE;')
}

let mockedUserId = USERNAMES.cedric.id

vi.mock('@middlewares/auth.middleware', () => ({
  AuthMiddleware: async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Mock the use of Json web token, all request will use the user referenced by id
    const mockedUser = {
      id: mockedUserId,
      username: 'cedric',
      email: 'cedric@example.com',
      password: 'no password',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: null,
    }
    req.user = mockedUser
    next()
  },
}))

describe('FollowRoute tests', () => {
  let app: App
  let expressApp: express.Application
  let followRoute: FollowRoute
  const prisma = new PrismaClient()

  beforeAll(async () => {
    followRoute = new FollowRoute()
    app = new App([new AuthRoute(), followRoute])
    expressApp = app.app
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    await truncateFollowsTable(prisma)
    mockedUserId = USERNAMES.cedric.id
  })

  describe('constructor', () => {
    test('should have the correct path', () => {
      expect(followRoute.path).toBe('/follows/')
    })
  })

  describe('follow route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[0].route.path).toBe('/follows/follow/:followingId')
    })

    test('should create a new row in follows table and send correct response', async () => {
      const response = await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('following request sent')

      const followRecord = await prisma.follows.findFirst({
        where: {
          followerId: 1,
          followingId: 4,
        },
      })

      expect(followRecord).not.toBeNull()
      if (followRecord) {
        expect(followRecord.followerId).toBe(1)
        expect(followRecord.followingId).toBe(4)
        expect(followRecord.subscribe).toBeNull()
      }
    })

    test('should throw an error when user to follow is not found', async () => {
      const unknownId = 100
      const response = await request(expressApp).post(`/follows/follow/${unknownId}`)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unable to find user to follow')
    })

    test('should throw an error when following yourself', async () => {
      const response = await request(expressApp).post(`/follows/follow/${USERNAMES.cedric.id}`)
      expect(response.status).toBe(401)
      expect(response.body.message).toBe('You cannot request to follow yourself')
    })

    test('should throw an error when already following user', async () => {
      await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`)
      const response = await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`)
      expect(response.status).toBe(401)
      expect(response.body.message).toBe('You already follow this user')
    })
  })

  describe('accept route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[1].route.path).toBe('/follows/accept/:followerId')
    })

    test('should update the subscribe field and send correct response', async () => {
      // INIT
      await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`)

      // RUN
      mockedUserId = USERNAMES.victor.id
      const response = await request(expressApp).put(`/follows/accept/${USERNAMES.cedric.id}`)

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('following request accepted')

      const followRecord = await prisma.follows.findFirst({
        where: {
          followerId: 1,
          followingId: 4,
        },
      })

      expect(followRecord).not.toBeNull()
      if (followRecord) {
        expect(followRecord.subscribe).not.toBeNull()
      }
    })

    test('should throw an error when follower id is not found', async () => {
      const unknownId = 100
      const response = await request(expressApp).put(`/follows/accept/${unknownId}`)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unable to find the follow request to accept')
    })

    test('should throw an error when following yourself', async () => {
      const response = await request(expressApp).put(`/follows/accept/${USERNAMES.cedric.id}`)
      expect(response.status).toBe(401)
      expect(response.body.message).toBe('You cannot follow yourself')
    })
  })

  describe('deleteFollowing route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[2].route.path).toBe('/follows/following/:followingId')
    })

    test('should delete a following', async () => {
      // INIT
      await seedFollow(prisma)
      // RUN
      const response = await request(expressApp).delete(`/follows/following/${USERNAMES.victor.id}`)
      // CHECK RESULTS
      expect(response.status).toBe(204)
      const followRecord = await prisma.follows.findFirst({
        where: {
          followerId: 1,
          followingId: 4,
        },
      })
      expect(followRecord).toBeNull()
    })

    test('should throw an error when following id is not found', async () => {
      const unknownId = 100
      const response = await request(expressApp).delete(`/follows/following/${unknownId}`)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unable to find the follow request to delete')
    })
  })

  describe('deleteFollower route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[3].route.path).toBe('/follows/follower/:followerId')
    })

    test('should delete a follower', async () => {
      // INIT
      await seedFollow(prisma)
      // RUN
      const response = await request(expressApp).delete(`/follows/follower/${USERNAMES.victor.id}`)
      // CHECK RESULTS
      expect(response.status).toBe(204)
      const followRecord = await prisma.follows.findFirst({
        where: {
          followerId: USERNAMES.victor.id,
          followingId: USERNAMES.cedric.id,
        },
      })
      expect(followRecord).toBeNull()
    })

    test('should throw an error when follower id is not found', async () => {
      const unknownId = 100
      const response = await request(expressApp).delete(`/follows/follower/${unknownId}`)
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Unable to find the follower to delete')
    })
  })

  describe('following route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[4].route.path).toBe('/follows/followings')
    })

    test('should return list of followings', async () => {
      // INIT
      await seedFollow(prisma)
      mockedUserId = USERNAMES.victor.id
      await request(expressApp).put(`/follows/accept/${USERNAMES.cedric.id}`)
      mockedUserId = USERNAMES.adrien.id
      await request(expressApp).put(`/follows/accept/${USERNAMES.cedric.id}`)

      // RUN
      mockedUserId = USERNAMES.cedric.id
      const response = await request(expressApp).get('/follows/followings')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(2)
      expect(response.body.data[0].id).toBe(2)
      expect(response.body.data[0].username).toBe('adrien')
      expect(response.body.data[0].password).toBeUndefined()
      expect(response.body.data[1].id).toBe(4)
      expect(response.body.data[1].username).toBe('victor')
      expect(response.body.data[1].password).toBeUndefined()
    })

    test('should return empty list when no followings', async () => {
      // INIT
      await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`) // request to follow will not be shown until accepted

      // RUN
      const response = await request(expressApp).get('/follows/followings')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })
  })

  describe('followers route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[5].route.path).toBe('/follows/followers')
    })

    test('should return list of followers ', async () => {
      // INIT
      await seedFollow(prisma)
      mockedUserId = USERNAMES.victor.id
      await request(expressApp).put(`/follows/accept/${USERNAMES.cedric.id}`)
      await request(expressApp).put(`/follows/accept/${USERNAMES.adrien.id}`)

      // RUN
      const response = await request(expressApp).get('/follows/followers')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(2)
      expect(response.body.data[0].id).toBe(1)
      expect(response.body.data[0].username).toBe('cedric')
      expect(response.body.data[0].password).toBeUndefined()
      expect(response.body.data[1].id).toBe(2)
      expect(response.body.data[1].username).toBe('adrien')
      expect(response.body.data[1].password).toBeUndefined()
    })

    test('should return empty list when no followers', async () => {
      // INIT
      await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`) // request to follow will not be shown

      // RUN
      const response = await request(expressApp).get('/follows/followers')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })
  })

  describe('getRequests route', () => {
    test('should have the correct path', () => {
      expect(followRoute.router.stack[6].route.path).toBe('/follows/requests')
    })

    test('should return list of follow requests', async () => {
      // INIT
      await seedFollow(prisma)
      mockedUserId = USERNAMES.victor.id

      // RUN
      const response = await request(expressApp).get('/follows/requests')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].id).toBe(2)
      expect(response.body.data[0].username).toBe('adrien')
      expect(response.body.data[0].password).toBeUndefined()
    })

    test('should return empty list when no follow requests', async () => {
      // INIT
      await request(expressApp).post(`/follows/follow/${USERNAMES.victor.id}`)
      mockedUserId = USERNAMES.victor.id
      await request(expressApp).put(`/follows/accept/${USERNAMES.cedric.id}`) // accepted so not shown in requests

      // RUN
      const response = await request(expressApp).get('/follows/requests')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })
  })
})
