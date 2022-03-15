import { Router } from 'express'
import schoolsRouter from './schoolsRouter'
import userRouter from './userRouter'
import usersRouter from './usersRouter'

const routes = Router()

routes.use('/api/v1/user', userRouter)
routes.use('/api/v1/users', usersRouter)
routes.use('/api/v1/schools', schoolsRouter)

export default routes
