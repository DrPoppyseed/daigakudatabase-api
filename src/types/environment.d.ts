import * as Express from 'express'

declare global {
  namespace Express {
    interface Request {
      firebaseToken?: Record<string, any>
    }
  }
}
