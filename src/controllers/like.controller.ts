import { NextFunction, Response } from 'express'
import Container from 'typedi'
import { RequestWithUser } from '../interfaces/auth.interface'
import { LikeService } from '../services/like.service'

export class LikeController {
  public likeService = Container.get(LikeService)

  public like = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const like = await this.likeService.like(req.user.id, parseInt(req.params.id))
      res.status(200).json({ data: like })
    } catch (error) {
      next(error)
    }
  }
}
