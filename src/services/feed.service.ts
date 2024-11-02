import Container, { Service } from 'typedi'
import { FollowService } from './follow.service'
import { AccountService } from './account.service'
import { prismaClient } from '@/prisma/prisma'
import { getRedisClient } from '@/utils/redis.service'
import { getLogger } from '@/utils/logger.service'

@Service()
export class FeedService {
  public follows = prismaClient.follows
  public logger = getLogger()
  public habits = prismaClient.habit
  public validations = prismaClient.validation
  public likes = prismaClient.like

  public accountService = Container.get(AccountService)
  public followService = Container.get(FollowService)

  public async getFeed(userId: number) {
    const cachedFeed = await getRedisClient().get(`user_feed:${userId}`)

    if (cachedFeed) {
      return JSON.parse(cachedFeed)
    }

    const following = await this.followService.getFollowings(userId)
    const followingValidation = await this.validations.findMany({
      orderBy: {
        validatedAt: 'desc',
      },
      where: {
        Habit: {
          userId: {
            in: following.map((follow) => follow.id),
          },
        },
      },
      include: {
        likedBy: {
          select: {
            userId: true,
          },
        },
        Habit: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                imageUrl: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    })

    getRedisClient().setEx(`user_feed:${userId}`, 60, JSON.stringify(followingValidation))
    return followingValidation
  }
}
