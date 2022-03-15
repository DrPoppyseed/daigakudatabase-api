import { Errback, Request, Response, NextFunction } from 'express'

const handleError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message: message,
    data: data,
  })
}

export default handleError
