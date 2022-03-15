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
const schoolsController_1 = require('../../core/controllers/schoolsController')
const schoolsRouter = express_1.default.Router()
schoolsRouter.get(
  '/',
  authenticateJWT_1.default,
  schoolsController_1.getSchools
)
exports.default = schoolsRouter
//# sourceMappingURL=schoolsRouter.js.map
