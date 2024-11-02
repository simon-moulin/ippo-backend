import express from 'express'
import compression from 'express'
import cors from 'cors'
import winston from 'winston'
import helmet from 'helmet'
import morgan from 'morgan'
import dayjs from 'dayjs'
import type { Request, Response } from 'express'
import { getLogger } from '@/utils/logger.service'
import { Routes } from '@/interfaces/routes.interface'
import { ErrorMiddleware } from '@/middlewares/error.middleware'
// import executionStatsCollector from './middlewares/executionStats.middleware'

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
    this.app.use(
      morgan(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (tokens: any, req: Request, res: Response) => {
          const date = dayjs().format('MM/DD HH:mm:ss')
          const ip = tokens['remote-addr'](req, res)
          const method = tokens.method(req, res)
          const url = tokens.url(req, res)
          const status = tokens.status(req, res)
          const responseTime = tokens['response-time'](req, res)

          return `${date} => ${`${method} ${url}`} from ${ip} ended in ${status} in ${responseTime}ms served`
        },
        { stream: { write: (message) => this.logger.info(message.replace('\n', '')) } }
      )
    )
    this.app.use(helmet())
    // this.app.use(executionStatsCollector)
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
