'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const authenticateJWT_1 = __importDefault(
  require('../middleware/authenticateJWT')
)
const usersController_1 = require('../../core/controllers/usersController')
const shallowVerify_1 = require('../middleware/shallowVerify')
const usersRouter = express_1.default.Router()
usersRouter.put(
  '/',
  authenticateJWT_1.default,
  shallowVerify_1.shallowVerify,
  usersController_1.signUp
)
usersRouter.get(
  '/',
  authenticateJWT_1.default,
  shallowVerify_1.shallowVerify,
  usersController_1.signIn
)
usersRouter.get(
  '/like',
  authenticateJWT_1.default,
  shallowVerify_1.shallowVerify,
  usersController_1.likeSchool
)
usersRouter.get(
  '/unlike',
  authenticateJWT_1.default,
  shallowVerify_1.shallowVerify,
  usersController_1.unlikeSchool
)
exports.default = usersRouter
//# sourceMappingURL=usersRouter.js.map
