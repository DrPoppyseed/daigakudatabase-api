const User = require('../../models/user')
const UserSchoolLike = require('../../models/userSchoolLike')

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

  User.findOne({ userId: user_id })
    .then(user => {
      if (!user) {
        if (req.header('X-Is-Google-SignIn')) {
          // if signIn with google is true and no corresponding user is created yet,
          // create new user w/ info from decoded firebaseToken
          const user = new User({
            userId: req.firebaseToken.uid,
            email: req.firebaseToken.email,
            emailVerified: req.firebaseToken.email_verified,
            thumbnail: req.firebaseToken.picture,
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
          const error = new Error('Could not find account with user ID')
          error.statusCode = 404
          throw error
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

exports.likeSchool = (req, res, next) => {
  const { user_id } = req.firebaseToken
  if (!user_id)
    res.status(401).json({ message: 'Invalid url: userId not found' })

  console.log(user_id)

  const ipeds_unitid = req.query.ipeds_unitid
  if (!ipeds_unitid)
    res.status(401).json({ message: 'Invalid url: ipeds_unitid not found' })

  const userSchoolLike = new UserSchoolLike({
    userId: user_id,
    ipeds_unitid: ipeds_unitid,
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

exports.unlikeSchool = (req, res, next) => {
  const { user_id } = req.firebaseToken
  const ipeds_unitid = req.query.ipeds_unitid

  console.log(ipeds_unitid)

  UserSchoolLike.deleteOne({ userId: user_id, ipeds_unitid: ipeds_unitid })
    .then(() => {
      User.findOne({ userId: user_id })
        .then(user => {
          if (!user) {
            const error = new Error('Could not find account with user ID')
            error.statusCode = 404
            throw error
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
