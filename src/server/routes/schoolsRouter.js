const express = require('express')
const schoolsRouter = express.Router()
const authenticateJWT = require('../middleware/authenticateJWT')
const schoolsController = require('../../core/controllers/schoolsController')

// router.get(
//   '/:schoolId',
//   authenticateJWT.authenticateJWT,
//   schoolsController.getSchoolById
// )

schoolsRouter.get(
  '/',
  authenticateJWT.authenticateJWT,
  schoolsController.getSchools
)

// router.get('/:schoolId/majors', schoolsController.getMajorsById)

export default schoolsRouter
