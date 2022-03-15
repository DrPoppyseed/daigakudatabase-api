import express from 'express'
import authenticateJWT from '../middleware/authenticateJWT'
import {
  likeSchool,
  signIn,
  signUp,
  unlikeSchool,
} from '../../core/controllers/usersController'
import { shallowVerify } from '../middleware/shallowVerify'

const usersRouter = express.Router()

usersRouter.put('/', authenticateJWT, shallowVerify, signUp)

usersRouter.get('/', authenticateJWT, shallowVerify, signIn)

usersRouter.get('/like', authenticateJWT, shallowVerify, likeSchool)

usersRouter.get('/unlike', authenticateJWT, shallowVerify, unlikeSchool)

export default usersRouter
