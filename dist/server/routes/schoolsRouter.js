"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var schoolsRouter = express.Router();
var authenticateJWT = require('../middleware/authenticateJWT');
var schoolsController = require('../../core/controllers/schoolsController');
// router.get(
//   '/:schoolId',
//   authenticateJWT.authenticateJWT,
//   schoolsController.getSchoolById
// )
schoolsRouter.get('/', authenticateJWT.authenticateJWT, schoolsController.getSchools);
// router.get('/:schoolId/majors', schoolsController.getMajorsById)
exports.default = schoolsRouter;
