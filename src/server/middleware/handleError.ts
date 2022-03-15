import { Request, Response } from 'express'

const handleError = (error: any, req: Request, res: Response) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message: message,
    data: data,
  })
}

export default handleError
