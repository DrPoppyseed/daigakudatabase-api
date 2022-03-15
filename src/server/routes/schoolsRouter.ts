import express from 'express'

const schoolsRouter = express.Router()
import authenticateJWT from '../middleware/authenticateJWT'
import { getSchools } from '../../core/controllers/schoolsController'

schoolsRouter.get('/', authenticateJWT, getSchools)

export default schoolsRouter
