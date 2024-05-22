import { Service } from 'typedi'
import { Follows } from '@prisma/client'
import { HttpException } from '../exceptions/http.exception'
import { User2DtoTransformer, UserDto } from '../dtos/user.dtos'
import { prismaClient } from '@/prisma/prisma'

@Service()
export class FollowService {
  public follows = prismaClient.follows

  public async isFollowing(userId: number, userId2: number): Promise<boolean> {
    const isFollowing = await this.follows.findFirst({
      where: {
        followerId: userId,
        followingId: userId2,
        subscribe: { not: null },
      },
    })
    if (isFollowing) {
      return true
    }
    return false
  }

  public async requestFollowing(userId: number, followingId: number): Promise<Follows> {
    if (await this.follows.findUnique({ where: { followId: { followerId: userId, followingId: followingId } } })) {
      throw new HttpException(401, 'You already follow this user')
    }
    if (userId === followingId) {
      throw new HttpException(401, 'You cannot request to follow yourself')
    }

    try {
      const created = await this.follows.create({
        data: {
          followerId: userId,
          followingId: followingId,
        },
      })
      return created
    } catch (error) {
      throw new HttpException(404, 'Unable to find user to follow')
    }
  }

  public async acceptFollowing(userId: number, followerId: number): Promise<Follows> {
    if (userId === followerId) {
      throw new HttpException(401, 'You cannot follow yourself')
    }
    try {
      const updated = await this.follows.update({
        where: {
          followId: {
            followerId: followerId,
            followingId: userId,
          },
        },
        data: {
          subscribe: new Date(),
        },
      })
      return updated
    } catch (error) {
      throw new HttpException(404, 'Unable to find the follow request to accept')
    }
  }

  public async deleteFollowing(userId: number, followingId: number): Promise<Follows> {
    try {
      return await this.follows.delete({
        where: {
          followId: {
            followerId: userId,
            followingId: followingId,
          },
        },
      })
    } catch (error) {
      throw new HttpException(404, 'Unable to find the follow request to delete')
    }
  }

  public async deleteFollower(userId: number, followerId: number): Promise<Follows> {
    try {
      return await this.follows.delete({
        where: {
          followId: {
            followerId: followerId,
            followingId: userId,
          },
        },
      })
    } catch (error) {
      throw new HttpException(404, 'Unable to find the follower to delete')
    }
  }

  public async getFollowings(userId: number): Promise<UserDto[]> {
    const follows = await this.follows.findMany({
      where: {
        followerId: userId,
        AND: {
          subscribe: { not: null },
        },
      },
      include: { following: true },
    })

    return follows.map((el) => {
      return User2DtoTransformer.userEntity2Dto(el.following)
    })
  }

  public async getFollowers(userId: number): Promise<UserDto[]> {
    const followers = await this.follows.findMany({
      where: {
        followingId: userId,
        AND: {
          subscribe: { not: null },
        },
      },
      include: { follower: true },
    })

    return followers.map((el) => {
      return User2DtoTransformer.userEntity2Dto(el.follower)
    })
  }

  public async getRequests(userId: number): Promise<UserDto[]> {
    const followers = await this.follows.findMany({
      where: {
        followingId: userId,
        AND: {
          subscribe: null,
        },
      },
      include: { follower: true },
    })

    return followers.map((el) => {
      return User2DtoTransformer.userEntity2Dto(el.follower)
    })
  }
}
