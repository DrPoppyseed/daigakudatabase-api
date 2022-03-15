import express from 'express'
import authenticateJWT from '../middleware/authenticateJWT'
import { getSchools } from '../../core/controllers/schoolsController'

const schoolsRouter = express.Router()

schoolsRouter.get('/', authenticateJWT, getSchools)

export default schoolsRouter
