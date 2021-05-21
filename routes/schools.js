const express = require('express')
const router = express.Router()
const authenticateJWT = require('../middleware/authenticateJWT')
const schoolsController = require('../controllers/schoolsController')

// router.post('/mypage/:page', schoolsController.getMyPage)
router.get(
  '/:schoolId',
  authenticateJWT.authenticateJWT,
  schoolsController.getSchoolById
)
router.get('/', authenticateJWT.authenticateJWT, schoolsController.getSchools)

module.exports = router
