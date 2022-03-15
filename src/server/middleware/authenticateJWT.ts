import { NextFunction, Request, Response } from 'express'

import admin from 'firebase-admin'

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const encodedToken = authHeader && authHeader.split(' ')[1]

  if (encodedToken == null) {
    req.firebaseToken = null as any
    next()
  } else {
    admin
      .auth()
      .verifyIdToken(encodedToken)
      .then(decodedToken => {
        req.firebaseToken = decodedToken
        next()
      })
      .catch(err => {
        req.firebaseToken = null as any
        next()
      })
  }
}

export default authenticateJWT
