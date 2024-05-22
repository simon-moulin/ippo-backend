import express from 'express'
import { Routes } from './interfaces/routes.interface'
import { ErrorMiddleware } from './middlewares/error.middleware'
import cors from 'cors'

export class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(routes: Routes[]) {
    this.app = express()
    this.env = 'development'
    this.port = 3000

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info('=================================')
      console.info(`======= ENV: ${this.env} =======`)
      console.info(`🚀 App listening on the port ${this.port}`)
      console.info('=================================')
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(cors())
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
