import { getLogger } from '@/services/logger.service'
import morgan from 'morgan'
import type { Request, Response } from 'express'
import dayjs from 'dayjs'

const logger = getLogger()

export const morganMiddleware = morgan(
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
  { stream: { write: (message) => logger.info(message.replace('\n', '')) } }
)
