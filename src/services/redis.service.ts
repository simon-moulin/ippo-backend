import { createClient, RedisClientType } from 'redis'
import { getLogger } from './logger.service'

let redisInstance: RedisClientType | null = null

export const getRedisClient = (): RedisClientType => {
  const logger = getLogger()

  if (!redisInstance) {
    redisInstance = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })

    redisInstance.on('error', (err) => {
      logger.error('Erreur Redis :', err)
    })

    redisInstance.connect()
  }

  return redisInstance
}
