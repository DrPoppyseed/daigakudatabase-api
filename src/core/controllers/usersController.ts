import UserImpl from '../../drivers/databaseImpls/userImpl'
import UserSchoolLikeImpl from '../../drivers/databaseImpls/userSchoolLikeImpl'
import { NextFunction, Request, Response } from 'express'
import { ResourceNotFoundError } from '../../utils/error'
import logger from '../../config/logger'

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  const user = new UserImpl({
    userId: req.body.user.uid,
    email: req.body.user.email,
    emailVerified: req.body.user.emailVerified || false,
    thumbnail: req.body.user.photoUrl,
    profileStatus: {
      status: 0,
    },
    personalAppState: {
      theme: 0,
    },
  })
  return user
    .save()
    .then(user => {
      res.status(201).json({ message: 'New user created', userId: user.userId })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const signIn = (req: Request, res: Response, next: NextFunction) => {
  const { email, email_verified, picture, user_id } = <any>req.firebaseToken

  UserImpl.findOne({ userId: user_id })
    .then(user => {
      if (!user) {
        if (req.header('X-Is-Google-SignIn')) {
          // if signIn with Google is true and no corresponding user is created yet,
          // create new user w/ info from decoded firebaseToken
          const user = new UserImpl({
            userId: user_id,
            email: email,
            emailVerified: email_verified,
            thumbnail: picture,
            profileStates: {
              status: 0,
            },
            personalAppState: {
              theme: 0,
            },
          })
          return user
            .save()
            .then(user => {
              res.status(201).json({
                message: 'New user created via Google auth',
                userId: user.userId,
              })
            })
            .catch(err => {
              if (!err.statusCode) err.statusCode = 500
              next(err)
            })
        } else {
          throw new ResourceNotFoundError()
        }
      }
      res.status(200).json({ message: 'User signed in', user: user })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

export const likeSchool = (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = <any>req.firebaseToken
  if (!user_id)
    res.status(401).json({ message: 'Invalid url: userId not found' })

  console.log(user_id)

  const ipeds_unitid = <string>req.query.ipeds_unitid
  if (!ipeds_unitid)
    res.status(401).json({ message: 'Invalid url: ipeds_unitid not found' })

  const userSchoolLike = new UserSchoolLikeImpl({
    userId: user_id,
    ipeds_unitid: ipeds_unitid,
  })

  userSchoolLike
    .save()
    .then(userSchoolLike => {
      UserImpl.findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            logger.error('user not found')
            throw new ResourceNotFoundError()
          } else {
            user.likedSchools.push(ipeds_unitid)
            user.save()
          }
        })
        .then(() => {
          res.status(201).json({
            message: 'school liked',
            ipeds_unitid: userSchoolLike.ipeds_unitid,
          })
        })
        .catch(err => {
          console.log(err)
          if (!err.statusCode) err.statusCode = 500
          next(err)
        })
    })
    .catch(err => {
      console.log(err)
      err.statusCode = !err.statusCode && 500
      next(err)
    })
}

export const unlikeSchool = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.firebaseToken as any
  const ipeds_unitid = req.query.ipeds_unitid

  console.log(ipeds_unitid)

  UserSchoolLikeImpl.deleteOne({ userId: user_id, ipeds_unitid: ipeds_unitid })
    .then(() => {
      UserImpl.findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            logger.error('user not found')
            throw new ResourceNotFoundError()
          } else {
            user.likedSchools = user.likedSchools.filter(
              school => school !== ipeds_unitid
            )
            user.save()
          }
        })
        .then(() => {
          res.status(204).json({ message: 'school unliked.' })
        })
        .catch(err => {
          console.log(err)
          if (!err.statusCode) err.statusCode = 500
          next(err)
        })
    })
    .catch(err => {
      console.log(err)
      err.statusCode = !err.statusCode && 500
      next(err)
    })
}
