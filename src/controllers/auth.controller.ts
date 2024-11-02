import { NextFunction, Request, Response } from 'express'
import { SignupDto, LoginDto } from '../dtos/auth.dtos'
import { Container } from 'typedi'
import { AuthService } from '../services/auth.service'
import { User } from '@prisma/client'
import { RequestWithUser } from '../interfaces/auth.interface'
import { MailService } from '@/services/mail.service'

export class AuthController {
  public auth = Container.get(AuthService)
  public mailService = Container.get(MailService)

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: SignupDto = req.body
      const signUpUserData: User = await this.auth.signup(userData)
      signUpUserData.password = ''

      res.status(201).json({ data: signUpUserData, token: await this.auth.generateToken(signUpUserData) })
    } catch (error) {
      next(error)
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginInfos: LoginDto = req.body

      const user = await this.auth.login(loginInfos)
      const userIp = req.socket.remoteAddress
      this.mailService.sendLoginEmail(user, userIp!)
      res.status(200).json({ data: user, token: await this.auth.generateToken(user) })
    } catch (error) {
      next(error)
    }
  }

  public me = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ data: req.user })
    } catch (error) {
      next(error)
    }
  }
}
