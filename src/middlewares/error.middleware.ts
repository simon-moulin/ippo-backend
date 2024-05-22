import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exceptions/http.exception'
import { Prisma } from '@prisma/client'

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500
    let message: string = error.message || 'Something went wrong'

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        message = 'There is a unique constraint violation'
      }
    }
    console.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`)
    res.status(status).json({ message })
  } catch (error) {
    next(error)
  }
}
