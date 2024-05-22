import Container, { Service } from 'typedi'
import { FollowService } from './follow.service'
import { AccountService } from './account.service'
import { prismaClient } from '@/prisma/prisma'

@Service()
export class FeedService {
  public follows = prismaClient.follows
  public habits = prismaClient.habit
  public validations = prismaClient.validation
  public likes = prismaClient.like

  public accountService = Container.get(AccountService)
  public followService = Container.get(FollowService)

  public async getFeed(userId: number) {
    // Fetch all validations from the user's friends
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
    return followingValidation
  }
}
