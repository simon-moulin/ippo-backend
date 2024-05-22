import { Service } from 'typedi'
import { Frequency, Habit } from '@prisma/client'
import { HttpException } from '../exceptions/http.exception'
import { HabitRequestDto } from '../dtos/habitRequest.dtos'
import { prismaClient } from '@/prisma/prisma'

@Service()
export class HabitService {
  public habits = prismaClient.habit
  public categories = prismaClient.category

  public async getHabitsByUser(userId: number) {
    return this.habits.findMany({
      where: { userId: userId, deleted: false },
    })
  }

  public async getHabitsWithDate(userId: number, date: Date) {
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return this.habits.findMany({
      where: { userId: userId },
      include: {
        validations: {
          where: { validatedAt: { gte: dateStart } },
          orderBy: { validatedAt: 'desc' }, // Order validations by createdAt in descending order
          take: 1, // Take only the first (latest) validation
        },
      },
    })
  }

  public async getPublicHabitsByUser(userId: number) {
    return this.habits.findMany({ where: { AND: [{ userId: userId }, { visibility: true }] } })
  }

  public async getFrenquencyHabitsByUser(userId: number, frequency: string) {
    const frequencyEnum: Frequency = Frequency[frequency.toUpperCase() as keyof typeof Frequency]
    if (!frequencyEnum) throw new HttpException(400, 'Invalid frequency')

    return this.habits.findMany({
      where: {
        userId: userId,
        AND: { frequency: frequencyEnum },
      },
    })
  }

  public async getHabit(habitId: number) {
    const habits = await this.habits.findUnique({ where: { id: habitId } })
    if (!habits) {
      throw new HttpException(404, 'Habit not found')
    }
    return habits
  }

  public async createHabit(userId: number, habitData: HabitRequestDto) {
    const category = await this.categories.findFirst({
      where: {
        name: habitData.categoryName,
      },
    })

    if (!category) {
      throw new HttpException(500, "The category doesn't exist")
    }

    const newHabit = await this.habits.create({
      data: {
        name: habitData.name,
        visibility: habitData.visibility,
        frequency: habitData.frequency,
        occurency: habitData.occurency,
        userId: userId,
        categoryId: category.id,
      },
    })

    if (!newHabit) {
      throw new HttpException(500, "The habit couldn't be created")
    }

    return newHabit
  }

  public async deleteUserHabit(userId: number, habitId: number): Promise<Habit> {
    // Check if the habits belongs to the user trying to delete it
    const habit = await this.habits.findFirst({
      where: { AND: [{ userId: userId }, { id: habitId }] },
    })

    // If not, throw error
    if (!habit) {
      throw new HttpException(401, 'This habit does not belong to user')
    }

    // If yes, delete it
    const deleted = await this.habits.update({
      where: { id: habitId },
      data: {
        deleted: true,
      },
    })
    return deleted
  }
}
