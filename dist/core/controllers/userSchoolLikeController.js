'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const getUserSchoolLikesUsecaseImpl_1 = __importDefault(
  require('../usecaseImpls/getUserSchoolLikesUsecaseImpl')
)
const userSchoolLikeRepositoryImpl_1 = __importDefault(
  require('../../adapters/respositoryImpls/userSchoolLikeRepositoryImpl')
)
const error_1 = require('../../utils/error')
const logger_1 = __importDefault(require('../../config/logger'))
class UserSchoolLikeController {
  constructor(userSchoolLikeStoreClient) {
    this.getUserLikes = (req, res, next) =>
      __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId
        try {
          const schoolLikes = yield this.getUserSchoolLikesUsecase.call(userId)
          const likedSchoolIds =
            schoolLikes === null || schoolLikes === void 0
              ? void 0
              : schoolLikes.map(el => el.ipeds_unitid)
          res.status(200).json({
            schoolIds: likedSchoolIds,
          })
        } catch (error) {
          logger_1.default.error(error)
          next(new error_1.InternalError())
        }
      })
    const userSchoolLikesRepository =
      new userSchoolLikeRepositoryImpl_1.default(userSchoolLikeStoreClient)
    this.getUserSchoolLikesUsecase =
      new getUserSchoolLikesUsecaseImpl_1.default(userSchoolLikesRepository)
  }
}
exports.default = UserSchoolLikeController
//# sourceMappingURL=userSchoolLikeController.js.map
