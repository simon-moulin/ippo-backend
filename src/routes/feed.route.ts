import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { FeedController } from '../controllers/feed.controller'

export class FeedRoute implements Routes {
  public path = '/feed/'
  public router = Router()
  public feedController = new FeedController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.feedController.getFeed)
  }
}
