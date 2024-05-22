import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { SECRET_KEY } from '../services/auth.service'
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface'
import { HttpException } from '../exceptions/http.exception'
import { prismaClient } from '@/prisma/prisma'

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization')
    let authorization = null
    if (header) authorization = header.split('Bearer ')[1]

    if (authorization) {
      const { id } = (await verify(authorization, SECRET_KEY)) as DataStoredInToken
      const users = prismaClient.user
      const findUser = await users.findUnique({ where: { id: Number(id) } })

      if (findUser) {
        findUser.password = ''
        req.user = findUser
        next()
      } else {
        console.log('this')
        next(new HttpException(401, 'Wrong authentication token'))
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'))
    }
  } catch (error) {
    console.log('that', error)
    next(new HttpException(401, 'Wrong authentication token'))
  }
}
