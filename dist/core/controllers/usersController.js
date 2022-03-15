'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.unlikeSchool =
  exports.likeSchool =
  exports.signIn =
  exports.signUp =
    void 0
const userImpl_1 = __importDefault(
  require('../../drivers/databaseImpls/userImpl')
)
const userSchoolLikeImpl_1 = __importDefault(
  require('../../drivers/databaseImpls/userSchoolLikeImpl')
)
const error_1 = require('../../utils/error')
const logger_1 = __importDefault(require('../../config/logger'))
const signUp = (req, res, next) => {
  const user = new userImpl_1.default({
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
exports.signUp = signUp
const signIn = (req, res, next) => {
  const { email, email_verified, picture, user_id } = req.firebaseToken
  userImpl_1.default
    .findOne({ userId: user_id })
    .then(user => {
      if (!user) {
        if (req.header('X-Is-Google-SignIn')) {
          // if signIn with Google is true and no corresponding user is created yet,
          // create new user w/ info from decoded firebaseToken
          const user = new userImpl_1.default({
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
          throw new error_1.ResourceNotFoundError()
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
exports.signIn = signIn
const likeSchool = (req, res, next) => {
  const { user_id } = req.firebaseToken
  if (!user_id)
    res.status(401).json({ message: 'Invalid url: userId not found' })
  console.log(user_id)
  const ipeds_unitid = req.query.ipeds_unitid
  if (!ipeds_unitid)
    res.status(401).json({ message: 'Invalid url: ipeds_unitid not found' })
  const userSchoolLike = new userSchoolLikeImpl_1.default({
    userId: user_id,
    ipeds_unitid: ipeds_unitid,
  })
  userSchoolLike
    .save()
    .then(userSchoolLike => {
      userImpl_1.default
        .findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            logger_1.default.error('user not found')
            throw new error_1.ResourceNotFoundError()
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
exports.likeSchool = likeSchool
const unlikeSchool = (req, res, next) => {
  const { user_id } = req.firebaseToken
  const ipeds_unitid = req.query.ipeds_unitid
  console.log(ipeds_unitid)
  userSchoolLikeImpl_1.default
    .deleteOne({ userId: user_id, ipeds_unitid: ipeds_unitid })
    .then(() => {
      userImpl_1.default
        .findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            logger_1.default.error('user not found')
            throw new error_1.ResourceNotFoundError()
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
exports.unlikeSchool = unlikeSchool
//# sourceMappingURL=usersController.js.map
