import { Habit } from '@prisma/client'
import { UserDto } from './user.dtos'

export interface AccountDto {
  username: string
  email: string
  imageUrl: string | null
  followers: UserDto[] | null
  followings: UserDto[] | null
  habits: Habit[] | null
  numberOfFollowers: number
  numberOfFollowings: number
  habitCount: number
}
