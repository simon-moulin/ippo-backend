import { describe, beforeEach, expect, test, vi, afterAll, beforeAll } from 'vitest'
import express, { NextFunction } from 'express'
import request from 'supertest'
import { HabitRoute } from '@routes/habit.route'
import { AuthRoute } from '@routes/auth.route'
import { App } from '@src/app'
import 'reflect-metadata'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { USERNAMES } from '@seeding/seedUsers'
import { CATEGORY_NAMES } from '@seeding/seedCategories'
import { seedHabits, HABIT_NAMES } from '@src/prisma/seeding/seedHabits'
import { RequestWithUser } from '@src/interfaces/auth.interface'

dotenv.config({ path: '.env.test' })

async function truncateHabitTable(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Habit" RESTART IDENTITY CASCADE;')
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

describe('HabitRoute tests', () => {
  let app: App
  let expressApp: express.Application
  let habotRoute: HabitRoute
  const prisma = new PrismaClient()

  beforeAll(async () => {
    habotRoute = new HabitRoute()
    app = new App([new AuthRoute(), habotRoute])
    expressApp = app.app
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    await truncateHabitTable(prisma)
    mockedUserId = USERNAMES.cedric.id
  })

  describe('constructor', () => {
    test('should initialize routes', () => {
      expect(habotRoute.path).toBe('/habits/')
    })
  })

  describe('post habit route', () => {
    test('should cerate an habit with correct data', async () => {
      // INIT
      const habit = {
        name: 'test habit',
        visibility: false,
        categoryName: CATEGORY_NAMES.sport.name,
        frequency: 'DAILY',
        occurency: 2,
      }

      // RUN
      const response = await request(expressApp).post('/habits/').send(habit)

      // CHECK RESULTS
      expect(response.status).toBe(201)
      expect(response.body.data.name).toBe(habit.name)
      expect(response.body.data.visibility).toBe(habit.visibility)
      expect(response.body.data.categoryId).toBe(CATEGORY_NAMES.sport.id)
      expect(response.body.data.userId).toBe(mockedUserId)
      expect(response.body.data.frequency).toBe('DAILY')
      expect(response.body.data.occurency).toBe(2)
    })

    test('should return 500 if category does not exist', async () => {
      // INIT
      const habit = {
        name: 'test habit',
        visibility: false,
        categoryName: 'non existent category',
        frequency: 'DAILY',
        occurency: 2,
      }

      // RUN
      const response = await request(expressApp).post('/habits/').send(habit)

      // CHECK RESULTS
      expect(response.status).toBe(500)
      expect(response.body.message).toBe("The category doesn't exist")
    })
  })

  describe('delete habit route', () => {
    test('should delete an habit', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      const response = await request(expressApp).delete(`/habits/${HABIT_NAMES.pullUps.id}`)

      // CHECK RESULTS
      expect(response.status).toBe(204)
      const habit = await prisma.habit.findFirst({ where: { id: HABIT_NAMES.pullUps.id } })
      expect(habit?.deleted).toBe(true)
    })

    test('should return 401 if habit does not belong to user', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      mockedUserId = USERNAMES.adrien.id
      const response = await request(expressApp).delete(`/habits/${HABIT_NAMES.pullUps.id}`)

      // CHECK RESULTS
      expect(response.status).toBe(401)
      expect(response.body.message).toBe('This habit does not belong to user')
    })
  })

  describe('get all habits route', () => {
    test('should return all habits', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      const response = await request(expressApp).get('/habits/')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(2)
      expect(response.body.data[0].name).toBe(HABIT_NAMES.pullUps.name)
      expect(response.body.data[1].name).toBe(HABIT_NAMES.proteinShake.name)
    })

    test('should return habits with specific frequency', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      const response = await request(expressApp).get('/habits/?frequency=DAILY')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].frequency).toBe('DAILY')
      expect(response.body.data[0].name).toBe(HABIT_NAMES.proteinShake.name)
    })

    test('should return empty array if no habits', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      mockedUserId = USERNAMES.testUser.id
      const response = await request(expressApp).get('/habits/')

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })

    test('should throw error if frequency is not valid', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      const response = await request(expressApp).get('/habits/?frequency=invalid')

      // CHECK RESULTS
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Invalid frequency')
    })
  })

  describe('get habit by id route', () => {
    test('should return habit', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      const response = await request(expressApp).get(`/habits/${HABIT_NAMES.pullUps.id}`)

      // CHECK RESULTS
      expect(response.status).toBe(200)
      expect(response.body.data.name).toBe(HABIT_NAMES.pullUps.name)
    })

    test('should return 404 if habit does not exist', async () => {
      // INIT
      await seedHabits(prisma)

      // RUN
      const response = await request(expressApp).get('/habits/9999')

      // CHECK RESULTS
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Habit not found')
    })
  })
})
