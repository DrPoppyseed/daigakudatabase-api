import morgan from 'morgan'
import logger from '../../config/logger'

const morganLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: any) => {
        return logger.http(message.trim())
      },
    },
  }
)

export default morganLogger
