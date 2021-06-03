const express = require('express')
const router = express.Router()
const authenticateJWT = require('../middleware/authenticateJWT')
const schoolsController = require('../controllers/schoolsController')

router.get(
  '/:schoolId',
  authenticateJWT.authenticateJWT,
  schoolsController.getSchoolById
)
router.get('/', authenticateJWT.authenticateJWT, schoolsController.getSchools)
router.get('/:schoolId/majors', schoolsController.getMajorsById)

module.exports = router
