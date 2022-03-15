const express = require('express')
const router = express.Router()
const userSchoolLikeController = require('../../core/controllers/userSchoolLikeController')
const userRouter = require('../../models/User')

router.get('/likes', userSchoolLikeController.getUserLikes)

module.exports = router
