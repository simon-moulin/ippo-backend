import { Follows, User } from '@prisma/client'

export class UserDto {
  public id: number

  public email: string

  public username: string

  public isPremium: boolean

  public imageUrl: string | null

  public status: null | 'following' | 'requested' | 'not_following'
}

export class User2DtoTransformer {
  static userEntity2Dto(user: User): UserDto {
    const userDto = new UserDto()
    userDto.id = user.id
    userDto.email = user.email
    userDto.isPremium = user.premium
    userDto.username = user.username
    userDto.imageUrl = user.imageUrl

    return userDto
  }

  static userEntity2DtoWithStatus(user: User, followers: Follows[], currentUserId: number): UserDto {
    const userDto = new UserDto()
    userDto.id = user.id
    userDto.email = user.email
    userDto.isPremium = user.premium
    userDto.username = user.username
    userDto.imageUrl = user.imageUrl

    const followStatus = followers.filter((el) => el.followerId == currentUserId && el.followingId == user.id)
    if (followStatus.length <= 0) {
      userDto.status = 'not_following'
    } else {
      if (followStatus[0].subscribe === null) {
        userDto.status = 'requested'
      } else {
        userDto.status = 'following'
      }
    }
    return userDto
  }
}
