import express from 'express'
import UserSchoolLikeController from '../../core/controllers/userSchoolLikeController'
import UserSchoolLikeImpl from '../../drivers/databaseImpls/userSchoolLikeImpl'

const userRouter = express.Router()

const userSchoolLikeController = new UserSchoolLikeController(
  UserSchoolLikeImpl
)

userRouter.get('/likes', userSchoolLikeController.getUserLikes)

export default userRouter
