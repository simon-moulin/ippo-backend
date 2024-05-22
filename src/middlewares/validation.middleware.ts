import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exceptions/http.exception'

export const ValidationMiddleware = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body)
    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
      .then(() => {
        req.body = dto
        next()
      })
      .catch((errors: ValidationError[]) => {
        const message = errors
          .map((error: ValidationError) => (error.constraints ? Object.values(error.constraints) : []))
          .join(', ')
        next(new HttpException(400, message))
      })
  }
}
