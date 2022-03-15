const UserSchoolLike = require('../../models/userSchoolLike')
const User = require('../../models/user')

exports.getUserLikes = (req, res, next) => {
  const userId = req.body.userId

  console.log(req.body)

  UserSchoolLike.find({ user_id: userId })
    .then(response => {
      const schoolIds = response.map(el => el.school_opeid6)
      res
        .status(200)
        .json({ message: 'liked schools fetched.', schoolIds: schoolIds })
    })
    .catch(err => {
      console.log(err)
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
