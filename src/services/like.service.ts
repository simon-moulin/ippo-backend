import { Like } from '@prisma/client'
import Container, { Service } from 'typedi'
import { FollowService } from './follow.service'
import { HttpException } from '../exceptions/http.exception'
import { ValidationService } from './validation.service'
import { prismaClient } from '@/prisma/prisma'

@Service()
export class LikeService {
  public likes = prismaClient.like
  public follows = prismaClient.follows
  public validations = prismaClient.validation

  private followService = Container.get(FollowService)
  private validationService = Container.get(ValidationService)

  public async like(userId: number, validationId: number): Promise<Like> {
    // check if user has already like
    const userHasLiked = await this.likes.findFirst({
      where: {
        validationId: validationId,
        AND: {
          userId: userId,
        },
      },
    })

    if (!userHasLiked) {
      const validationUserOwner = await this.validationService.getUserOfValidation(validationId)
      const following = await this.followService.getFollowings(userId)

      // Si l'user de la validation appartient à la liste des personnes suivies par userId alors userId peut liker
      const userExists = following.find((user) => user.id === validationUserOwner?.id) !== undefined
      if (userExists) {
        return await this.likes.create({
          data: {
            userId: userId,
            validationId: validationId,
          },
        })
      } else {
        throw new HttpException(401, 'You cannot like this user')
      }
    } else {
      // unlike
      return await this.likes.delete({
        where: {
          id: userHasLiked.id,
        },
      })
    }
  }
}
