import winston from 'winston'

const { combine, printf, align, timestamp, colorize } = winston.format

const logger = winston.createLogger({
  level: 'http',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info: any) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
})

export default logger
