import { NextFunction, Response } from 'express'
import { Container } from 'typedi'
import { RequestWithUser } from '../interfaces/auth.interface'
import { HabitService } from '../services/habit.service'
import { HabitRequestDto } from '../dtos/habitRequest.dtos'
import { CategoryService } from '@/services/category.service'

export class HabitController {
  public habit = Container.get(HabitService)
  public categoryService = Container.get(CategoryService)

  public getUserHabits = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    const { frequency } = req.query

    // TODO: refactor "la conception est foireuse"
    const date = req.query.date

    try {
      if (date) {
        const value = await this.habit.getHabitsWithDate(req.user.id, new Date(date.toString()))
        res.status(200).json({ data: value })
      } else {
        const value =
          frequency == null
            ? await this.habit.getHabitsByUser(req.user.id)
            : await this.habit.getFrenquencyHabitsByUser(req.user.id, frequency.toString())
        res.status(200).json({ data: value })
      }
    } catch (error) {
      next(error)
    }
  }

  public getHabit = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const value = await this.habit.getHabit(parseInt(req.params.id))
      res.status(200).json({ data: value })
    } catch (error) {
      next(error)
    }
  }

  public getHabitCategory = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const value = await this.categoryService.getAll()
      res.status(200).json({ data: value })
    } catch (err) {
      next(err)
    }
  }

  public createHabit = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitData: HabitRequestDto = req.body
      const value = await this.habit.createHabit(req.user.id, habitData)
      res.status(201).json({ data: value })
    } catch (error) {
      next(error)
    }
  }

  public deleteHabit = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.habit.deleteUserHabit(req.user.id, parseInt(req.params.id))
      res.status(204).json()
    } catch (error) {
      next(error)
    }
  }
}
