var express = require('express');
var authenticateJWT = require('../middleware/authenticateJWT');
var router = express.Router();
var usersController = require('../../core/controllers/usersController');
router.put('/', authenticateJWT.authenticateJWT, usersController.signUp);
router.get('/', authenticateJWT.authenticateJWT, usersController.signIn);
/** TODO: router for user updates (i.e. profile edits and saves) */
/** TODO: router for user deletion (i.e. profile & user deleted) */
router.get('/like', authenticateJWT.authenticateJWT, usersController.likeSchool);
router.get('/unlike', authenticateJWT.authenticateJWT, usersController.unlikeSchool);
module.exports = router;
