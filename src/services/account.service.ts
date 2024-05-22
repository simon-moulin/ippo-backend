import Container, { Service } from 'typedi'
import { FollowService } from './follow.service'
import { HabitService } from './habit.service'
import { User2DtoTransformer } from '../dtos/user.dtos'
import { HttpException } from '@/exceptions/http.exception'
import { AccountDto } from '@/dtos/account.dtos'
import { prismaClient } from '@/prisma/prisma'
import Stripe from 'stripe'

const stripeClient = new Stripe(process.env.STRIPE_KEY!)

@Service()
export class AccountService {
  public users = prismaClient.user

  private followService = Container.get(FollowService)
  private habitService = Container.get(HabitService)

  public getMyInfo = async (userId: number): Promise<AccountDto> => {
    try {
      const user = await this.users.findFirst({ where: { id: userId } })
      const followers = await this.followService.getFollowers(userId)
      const followings = await this.followService.getFollowings(userId)
      const habits = await this.habitService.getHabitsByUser(userId)

      if (user == null) {
        throw new HttpException(404, 'User not found')
      }
      const userDto = User2DtoTransformer.userEntity2Dto(user)

      return {
        ...userDto,
        habits,
        followers,
        followings,
        habitCount: habits.length,
        numberOfFollowers: followers.length,
        numberOfFollowings: followings.length,
      }
    } catch (error) {
      throw new HttpException(500, 'An error occured')
    }
  }

  public getUserInfo = async (currentUserId: number, userId: number): Promise<AccountDto> => {
    try {
      const user = await this.users.findFirst({ where: { id: userId } })
      const followers = await this.followService.getFollowers(userId)
      const followings = await this.followService.getFollowings(userId)
      const habits = await this.habitService.getPublicHabitsByUser(userId)
      const numberOfFollowers = followers.length
      const numberOfFollowings = followings.length
      const habitCount = habits.length

      if (user == null) {
        throw new HttpException(404, 'User not found')
      }
      const userDto = User2DtoTransformer.userEntity2Dto(user)

      const res = { ...userDto, numberOfFollowers, numberOfFollowings, habitCount }

      const fol = await this.followService.isFollowing(currentUserId, userId)

      if (!fol) {
        return { ...res, habits: null, followers: null, followings: null }
      }

      return { ...res, habits, followers, followings }
    } catch (error) {
      throw new HttpException(500, 'An error occured')
    }
  }

  public setSubscription = async (stripeId: string, premium: boolean) => {
    try {
      await this.users.update({
        where: { stripeId: stripeId },
        data: {
          premium: premium,
        },
      })
    } catch (err) {
      throw new HttpException(500, 'An error occured')
    }
  }

  public getManagerSubLink = async (stripeId: string) => {
    const session = await stripeClient.billingPortal.sessions.create({
      customer: stripeId,
      return_url: `${process.env.APP_URL}`,
    })

    return session.url
  }

  public subscribe = async (userId: number) => {
    try {
      const user = await this.users.findFirst({ where: { id: userId } })
      const session = await stripeClient.checkout.sessions.create({
        line_items: [
          {
            price: process.env.STRIPE_SUB_ID,
            quantity: 1,
          },
        ],
        customer: user!.stripeId!,
        mode: 'subscription',
        success_url: `${process.env.APP_URL}me`,
        cancel_url: `${process.env.APP_URL}me`,
      })
      return session.url
    } catch (err) {
      throw new HttpException(500, 'An error occured')
    }
  }

  public getUserByStripeId = async (stripeId: string) => {
    try {
      const user = this.users.findUnique({ where: { stripeId: stripeId } })
      return user
    } catch (error) {
      throw new HttpException(500, 'An error occured')
    }
  }

  public getAllUsers = async (userId: number, username: string | undefined, takeNumber: number, skipNumber: number) => {
    if (!username || username.length == 0) {
      return []
    }
    try {
      const users = await this.users.findMany({
        take: takeNumber,
        skip: skipNumber,
        where: {
          username: {
            contains: username,
          },
        },
        include: {
          followers: true,
        },
        orderBy: {
          username: 'asc',
        },
      })

      const tmp = users.map((el) => User2DtoTransformer.userEntity2DtoWithStatus(el, el.followers, userId))

      return tmp
    } catch (error) {
      throw new HttpException(500, 'An error occured')
    }
  }
}
