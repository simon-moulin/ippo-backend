import { createClient, RedisClientType } from 'redis'

let redisInstance: RedisClientType | null = null

export const getRedisClient = (): RedisClientType => {
  if (!redisInstance) {
    redisInstance = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })

    redisInstance.connect()
  }

  return redisInstance
}
