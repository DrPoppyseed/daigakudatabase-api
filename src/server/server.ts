import app from './app'
import logger from '../config/logger'

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port:${process.env.PORT}`)
})
