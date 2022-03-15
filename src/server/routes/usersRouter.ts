import express from 'express'
import authenticateJWT from '../middleware/authenticateJWT'

const usersRouter = express.Router()

import usersController from '../../core/controllers/usersController'

usersRouter.put('/', authenticateJWT, usersController.signUp)

usersRouter.get('/', authenticateJWT, usersController.signIn)

usersRouter.get('/like', authenticateJWT, usersController.likeSchool)

usersRouter.get('/unlike', authenticateJWT, usersController.unlikeSchool)

export default usersRouter
