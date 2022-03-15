import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '../../utils/error'

export const shallowVerify = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.firebaseToken
  const userId = token ? token.user_id : null

  if (userId) {
    res.locals.shallowValidAuth = true
    res.locals.firebaseUuid = userId
    next()
  } else {
    res.locals.shallowValidAuth = false
    next(new ForbiddenError())
  }
}
