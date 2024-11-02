import express from 'express'
import compression from 'express'
import cors from 'cors'
import winston from 'winston'
import { getLogger } from '@/services/logger.service'
import { Routes } from '@/interfaces/routes.interface'
import { ErrorMiddleware } from '@/middlewares/error.middleware'
import { morganMiddleware } from './middlewares/morgan.middleware'
import helmet from 'helmet'

export class App {
  public app: express.Application
  public logger: winston.Logger
  public env: string
  public port: string | number

  constructor(routes: Routes[]) {
    this.app = express()
    this.env = 'development'
    this.logger = getLogger()
    this.port = 3000

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      this.logger.info('=================================')
      this.logger.info(`======= ENV: ${this.env} =======`)
      this.logger.info(`🚀 App listening on the port ${this.port}`)
      this.logger.info('=================================')
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(compression())
    this.app.use(morganMiddleware)
    this.app.use(helmet())
    this.app.use('/stripe/webhook', express.raw({ type: '*/*' }))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware)
  }
}
