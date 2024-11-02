import winston from 'winston'

let logger: winston.Logger | null = null

export const getLogger = (): winston.Logger => {
  if (!logger) {
    logger = winston.createLogger({
      level: 'info', // Niveau de log par défaut
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    })
  }

  return logger
}
