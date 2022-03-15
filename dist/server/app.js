'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const dotenv_1 = __importDefault(require('dotenv'))
const handleError_1 = __importDefault(require('./middleware/handleError'))
const routes_1 = __importDefault(require('./routes'))
const mongodb_1 = __importDefault(require('../config/mongodb'))
const express_1 = __importDefault(require('express'))
const helmet_1 = __importDefault(require('helmet'))
const cookie_parser_1 = __importDefault(require('cookie-parser'))
const firebase_admin_1 = __importDefault(require('firebase-admin'))
const express_rate_limit_1 = __importDefault(require('express-rate-limit'))
const cors_1 = __importDefault(require('cors'))
const morganLogger_1 = __importDefault(require('./middleware/morganLogger'))
const logger_1 = __importDefault(require('../config/logger'))
dotenv_1.default.config()
const app = (0, express_1.default)()
app.set('trust proxy', 1)
const limiter = (0, express_rate_limit_1.default)({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX),
})
app.use(limiter)
app.use((0, helmet_1.default)())
const corsOption = {
  origin: true,
  secure: process.env.NODE_ENV !== 'development',
}
app.use((0, cors_1.default)(corsOption))
app.use((0, cookie_parser_1.default)())
app.use(morganLogger_1.default)
app.use(express_1.default.json())
app.use(express_1.default.urlencoded({ extended: true }))
app.use(express_1.default.static('public'))
firebase_admin_1.default.initializeApp({
  credential: firebase_admin_1.default.credential.cert(
    JSON.parse(process.env.FIREBASE_SA_CREDENTIALS)
  ),
})
;(0, mongodb_1.default)()
  .then(() => {
    app.use(routes_1.default)
    app.use(handleError_1.default)
    app.get('/', (req, res) => {
      logger_1.default.info('Console is working properly!')
      res.status(200).send('Server is running!')
    })
  })
  .catch(error => {
    logger_1.default.error(error)
  })
exports.default = app
//# sourceMappingURL=app.js.map
