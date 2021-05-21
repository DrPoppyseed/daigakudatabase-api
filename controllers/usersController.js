const User = require('../models/user')
const UserSchoolLike = require('../models/userSchoolLike')

exports.signUp = (req, res, next) => {
  const user = new User({
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

exports.signIn = (req, res, next) => {
  const { user_id } = req.firebaseToken
  console.log(user_id)

  User.findOne({ userId: user_id })
    .then(user => {
      if (!user) {
        const error = new Error('Could not find account with user ID')
        error.statusCode = 404
        throw error
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

exports.likeSchool = (req, res, next) => {
  const { user_id } = req.firebaseToken
  if (!user_id)
    res.status(401).json({ message: 'Invalid url: userId not found' })

  const schoolId = req.query.schoolId
  if (!schoolId)
    res.status(401).json({ message: 'Invalid url: schoolId not found' })

  const userSchoolLike = new UserSchoolLike({
    userId: user_id,
    school_uuid: schoolId,
  })

  userSchoolLike
    .save()
    .then(userSchoolLike => {
      User.findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            const error = new Error('Could not find account with user ID')
            error.statusCode = 404
            throw error
          } else {
            user.likedSchools.push(schoolId)
            user.save()
          }
        })
        .then(() => {
          res.status(201).json({
            message: 'school liked',
            schoolId: userSchoolLike.school_uuid,
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

exports.unlikeSchool = (req, res, next) => {
  const { user_id } = req.firebaseToken
  const schoolId = req.query.schoolId

  UserSchoolLike.deleteOne({ userId: user_id, school_uuid: schoolId })
    .then(() => {
      User.findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            const error = new Error('Could not find account with user ID')
            error.statusCode = 404
            throw error
          } else {
            user.likedSchools = user.likedSchools.filter(
              school => school !== schoolId
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
