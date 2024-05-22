import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { HabitController } from '../controllers/habit.controller'
import { HabitRequestDto } from '../dtos/habitRequest.dtos'
import { ValidationMiddleware } from '../middlewares/validation.middleware'

export class HabitRoute implements Routes {
  public path = '/habits/'
  public router = Router()
  public habitController = new HabitController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      AuthMiddleware,
      ValidationMiddleware(HabitRequestDto),
      this.habitController.createHabit
    )
    this.router.delete(`${this.path}:id`, AuthMiddleware, this.habitController.deleteHabit)
    this.router.get(`${this.path}`, AuthMiddleware, this.habitController.getUserHabits)
    this.router.get(`${this.path}category`, AuthMiddleware, this.habitController.getHabitCategory)
    this.router.get(`${this.path}:id`, AuthMiddleware, this.habitController.getHabit)
  }
}
