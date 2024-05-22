import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'

import { ValidationMiddleware } from '../middlewares/validation.middleware'
import { AuthController } from '../controllers/auth.controller'
import { SignupDto, LoginDto } from '../dtos/auth.dtos'
import { AuthMiddleware } from '../middlewares/auth.middleware'

export class AuthRoute implements Routes {
  public path = '/auth/'
  public router = Router()
  public auth = new AuthController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, ValidationMiddleware(SignupDto), this.auth.signUp)
    this.router.post(`${this.path}login`, ValidationMiddleware(LoginDto), this.auth.logIn)
    this.router.get(`${this.path}me`, AuthMiddleware, this.auth.me)
  }
}
