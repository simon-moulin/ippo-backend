import { Request, Response, NextFunction } from 'express'

interface RouteStats {
  totalTime: number
  avg: number
  count: number
}

const stats: { [key: string]: RouteStats } = {}

const executionStatsCollector = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime()

  res.on('finish', () => {
    const duration = process.hrtime(start)
    const milliseconds = duration[0] * 1000 + duration[1] / 1e6 // Convert to milliseconds

    const routeKey = `${req.method} ${req.originalUrl}`
    if (!stats[routeKey]) {
      stats[routeKey] = { totalTime: 0, count: 0, avg: 0 }
    }

    stats[routeKey].totalTime += milliseconds
    stats[routeKey].count += 1
    stats[routeKey].avg = stats[routeKey].totalTime / stats[routeKey].count

    console.log(`Average execution time for ${routeKey}: ${stats[routeKey].avg.toFixed(3)} ms`)
    // console.log('all', stats)
  })

  next()
}

export default executionStatsCollector
