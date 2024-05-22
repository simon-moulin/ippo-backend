import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { ValidationController } from '../controllers/validation.controller'
import { LikeController } from '../controllers/like.controller'

export class ValidationRoute implements Routes {
  public path = '/validation/'
  public router = Router()
  public validationController = new ValidationController()
  public likeController = new LikeController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, AuthMiddleware, this.validationController.validate)
    this.router.delete(`${this.path}:validationId`, AuthMiddleware, this.validationController.invalidate)

    this.router.post(`${this.path}:id/likes/`, AuthMiddleware, this.likeController.like)
  }
}
