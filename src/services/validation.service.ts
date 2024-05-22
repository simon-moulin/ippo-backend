import { User, Validation } from '@prisma/client'
import { Service } from 'typedi'
import { HttpException } from '../exceptions/http.exception'
import { prismaClient } from '@/prisma/prisma'

@Service()
export class ValidationService {
  public habits = prismaClient.habit
  public validations = prismaClient.validation

  public async validate(userId: number, habitId: number): Promise<Validation> {
    const habit = await this.habits.findUnique({
      where: {
        id: habitId,
        userId: userId,
      },
    })

    if (!habit) {
      throw new HttpException(403, 'Habit does not belong to user')
    }

    // check if validation exists with validatedAt same day
    const validation = await this.checkIfValidationExist(habitId)

    if (validation) {
      let updated
      if (validation.counter >= habit.occurency) {
        updated = await this.validations.update({
          where: {
            id: validation.id,
          },
          data: {
            isValid: true,
          },
        })
      } else {
        updated = await this.validations.update({
          where: {
            id: validation.id,
          },
          data: {
            counter: validation.counter + 1,
          },
        })
      }
      return updated
    } else {
      const created = await this.validations.create({
        data: {
          habitId: habitId,
          isValid: habit.occurency == 1,
          counter: 1,
        },
      })

      return created
    }
  }

  private async checkIfValidationExist(habitId: number) {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const validation = await this.validations.findFirst({
      where: {
        habitId: habitId,
        validatedAt: {
          gte: todayStart,
        },
      },
    })
    return validation
  }

  public async invalidate(userId: number, validationId: number): Promise<Validation> {
    const user = await this.getUserOfValidation(validationId)

    if (!user) {
      throw new HttpException(404, 'User not found')
    }

    if (user.id != userId) {
      throw new HttpException(403, 'You cannot delete this validation')
    }

    const deleted = await this.validations.delete({
      where: {
        id: validationId,
        AND: {
          isValid: true,
        },
      },
    })

    return deleted
  }

  // Tools method to get the user of a validation
  public async getUserOfValidation(validationId: number): Promise<User> {
    const theValidation = await this.validations.findFirst({
      where: {
        id: validationId,
      },
      include: {
        Habit: {
          include: {
            user: true,
          },
        },
      },
    })
    if (theValidation?.Habit?.user) {
      return theValidation.Habit.user
    }
    throw new HttpException(500, 'The validation doesnt exist')
  }
}
