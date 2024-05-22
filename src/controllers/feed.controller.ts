import { NextFunction, Response } from 'express'
import { Container } from 'typedi'
import { RequestWithUser } from '../interfaces/auth.interface'
import { FeedService } from '../services/feed.service'

export class FeedController {
  public feedService = Container.get(FeedService)

  public getFeed = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habits = await this.feedService.getFeed(req.user.id)
      res.status(200).json({ data: habits })
    } catch (error) {
      next(error)
    }
  }
}
