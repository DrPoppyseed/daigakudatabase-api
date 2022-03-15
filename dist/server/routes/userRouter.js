var express = require('express');
var router = express.Router();
var userSchoolLikeController = require('../../core/controllers/userSchoolLikeController');
var userRouter = require('../../models/User');
router.get('/likes', userSchoolLikeController.getUserLikes);
module.exports = router;
