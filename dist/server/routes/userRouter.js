'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const userSchoolLikeController_1 = __importDefault(
  require('../../core/controllers/userSchoolLikeController')
)
const userSchoolLikeImpl_1 = __importDefault(
  require('../../drivers/databaseImpls/userSchoolLikeImpl')
)
const userRouter = express_1.default.Router()
const userSchoolLikeController = new userSchoolLikeController_1.default(
  userSchoolLikeImpl_1.default
)
userRouter.get('/likes', userSchoolLikeController.getUserLikes)
exports.default = userRouter
//# sourceMappingURL=userRouter.js.map
