import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { SECRET_KEY } from '../services/auth.service'
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface'
import { HttpException } from '../exceptions/http.exception'
import { prismaClient } from '@/prisma/prisma'
import type { User } from '@prisma/client'
import { getRedisClient } from '@/services/redis.service'

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const redisClient = getRedisClient()
    const header = req.header('Authorization')
    let authorization = null
    if (header) authorization = header.split('Bearer ')[1]

    if (authorization) {
      const { id } = (await verify(authorization, SECRET_KEY)) as DataStoredInToken
      const users = prismaClient.user

      let findUser: User | null = null

      const findUserRedis = await redisClient.get('USER_' + id)

      if (!findUserRedis) {
        findUser = await users.findUnique({ where: { id: Number(id) } })
        redisClient.setEx('USER_' + id, 30, JSON.stringify(findUser))
      } else {
        findUser = JSON.parse(findUserRedis)
      }

      if (findUser) {
        findUser.password = ''
        req.user = findUser
        next()
      } else {
        next(new HttpException(401, 'Wrong authentication token'))
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'))
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'))
  }
}
