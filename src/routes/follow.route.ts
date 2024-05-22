import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { FollowController } from '../controllers/follow.controller'

export class FollowRoute implements Routes {
  public path = '/follows/'
  public router = Router()
  public followController = new FollowController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}follow/:followingId`, AuthMiddleware, this.followController.requestFollowing)
    this.router.put(`${this.path}accept/:followerId`, AuthMiddleware, this.followController.acceptFollowing)
    this.router.delete(`${this.path}following/:followingId`, AuthMiddleware, this.followController.deleteFollowing)
    this.router.delete(`${this.path}follower/:followerId`, AuthMiddleware, this.followController.deleteFollower)

    this.router.get(`${this.path}followings`, AuthMiddleware, this.followController.getFollowings)
    this.router.get(`${this.path}followers`, AuthMiddleware, this.followController.getFollowers)
    this.router.get(`${this.path}requests`, AuthMiddleware, this.followController.getRequests)
  }
}
