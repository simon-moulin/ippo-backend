import { NextFunction, Response } from 'express'
import { Container } from 'typedi'
import { RequestWithUser } from '../interfaces/auth.interface'
import { FollowService } from '../services/follow.service'

export class FollowController {
  public followService = Container.get(FollowService)

  public requestFollowing = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.followService.requestFollowing(req.user.id, parseInt(req.params.followingId))
      res.status(200).json({ message: 'following request sent' })
    } catch (error) {
      next(error)
    }
  }

  public acceptFollowing = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.followService.acceptFollowing(req.user.id, parseInt(req.params.followerId))
      res.status(200).json({ message: 'following request accepted' })
    } catch (error) {
      next(error)
    }
  }

  public deleteFollowing = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.followService.deleteFollowing(req.user.id, parseInt(req.params.followingId))
      res.status(204).json({ message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public deleteFollower = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.followService.deleteFollower(req.user.id, parseInt(req.params.followerId))
      res.status(204).json({ message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public getFollowings = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const following = await this.followService.getFollowings(req.user.id)
      res.status(200).json({ data: following })
    } catch (error) {
      next(error)
    }
  }

  public getFollowers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const followers = await this.followService.getFollowers(req.user.id)
      res.status(200).json({ data: followers })
    } catch (error) {
      next(error)
    }
  }

  public getRequests = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const followerRequests = await this.followService.getRequests(req.user.id)
      res.status(200).json({ data: followerRequests })
    } catch (error) {
      next(error)
    }
  }
}
