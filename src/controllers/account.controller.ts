import Container from 'typedi'
import { NextFunction, Response } from 'express'
import { RequestWithUser } from '../interfaces/auth.interface'
import { AccountService } from '../services/account.service'
export class AccountController {
  private accountService = Container.get(AccountService)

  public me = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userInfo = await this.accountService.getMyInfo(req.user.id)
      res.status(200).json({ data: { ...userInfo } })
    } catch (error) {
      next(error)
    }
  }

  public getUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userInfo = await this.accountService.getUserInfo(req.user.id, parseInt(req.params.userId))
      res.status(200).json({ data: { ...userInfo } })
    } catch (error) {
      next(error)
    }
  }

  public subscribe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const url = await this.accountService.subscribe(req.user.id)
      res.status(200).json({ url: url })
    } catch (error) {
      next(error)
    }
  }

  public getManageLink = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const url = await this.accountService.getManagerSubLink(req.user.stripeId!)
      res.status(200).json({ url: url })
    } catch (error) {
      next(error)
    }
  }

  public getAllUsers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usernameSearchQuery = req.query.username
      const take = req.query.take != undefined ? parseInt(req.query.take.toString()) : 25
      const skip = req.query.skip != undefined ? parseInt(req.query.skip.toString()) : 0

      let users = await this.accountService.getAllUsers(req.user.id, usernameSearchQuery?.toString(), take, skip)
      users = users.filter((user) => user.id != req.user.id)
      res.status(200).json({ data: users })
    } catch (error) {
      next(error)
    }
  }
}
