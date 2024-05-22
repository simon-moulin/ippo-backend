import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'
import { StripeController } from '../controllers/stripe.controller'

export class StripeRoute implements Routes {
  public path = '/stripe/'
  public router = Router()
  public stripeController = new StripeController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}webhook`, this.stripeController.webhook)
  }
}
