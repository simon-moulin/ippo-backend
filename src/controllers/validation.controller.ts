import { NextFunction, Response } from 'express'
import Container from 'typedi'
import { ValidationService } from '../services/validation.service'
import { RequestWithUser } from '../interfaces/auth.interface'
import { ValidationDto } from '../dtos/validation.dtos'

export class ValidationController {
  public validationService = Container.get(ValidationService)

  public validate = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validationData: ValidationDto = req.body
      const validation = await this.validationService.validate(req.user.id, validationData.habitId)
      res.status(201).json({ data: validation })
    } catch (error) {
      next(error)
    }
  }

  public invalidate = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validationData = parseInt(req.params.validationId)
      const deleteValidation = await this.validationService.invalidate(req.user.id, validationData)
      res.status(200).json({ data: deleteValidation })
    } catch (error) {
      next(error)
    }
  }
}
