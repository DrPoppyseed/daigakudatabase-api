const express = require('express')
const router = express.Router()
const userSchoolLikeController = require('../controllers/userSchoolLikeController')
const user = require('../models/user')

router.get('/likes', userSchoolLikeController.getUserLikes)

module.exports = router
