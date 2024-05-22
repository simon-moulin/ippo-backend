import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { AccountController } from '../controllers/account.controller'

export class AccountRoute implements Routes {
  public path = '/accounts/'
  public router = Router()
  public accountController = new AccountController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}me`, AuthMiddleware, this.accountController.me)
    this.router.get(`${this.path}sub`, AuthMiddleware, this.accountController.subscribe)
    this.router.get(`${this.path}managesubscription`, AuthMiddleware, this.accountController.getManageLink)
    this.router.get(`${this.path}:userId`, AuthMiddleware, this.accountController.getUser)
    this.router.get(`${this.path}`, AuthMiddleware, this.accountController.getAllUsers)
  }
}
