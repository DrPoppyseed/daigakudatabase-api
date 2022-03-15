'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const firebase_admin_1 = __importDefault(require('firebase-admin'))
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const encodedToken = authHeader && authHeader.split(' ')[1]
  if (encodedToken == null) {
    req.firebaseToken = null
    next()
  } else {
    firebase_admin_1.default
      .auth()
      .verifyIdToken(encodedToken)
      .then(decodedToken => {
        req.firebaseToken = decodedToken
        next()
      })
      .catch(err => {
        req.firebaseToken = null
        next()
      })
  }
}
exports.default = authenticateJWT
//# sourceMappingURL=authenticateJWT.js.map
