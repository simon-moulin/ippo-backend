import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exceptions/http.exception'
import { Prisma } from '@prisma/client'
import { getLogger } from '@/utils/logger.service'

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500
    const logger = getLogger()
    let message: string = error.message || 'Something went wrong'

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        message = 'There is a unique constraint violation'
      }
    }
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`)
    res.status(status).json({ message })
  } catch (error) {
    next(error)
  }
}
