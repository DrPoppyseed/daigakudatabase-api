'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const app_1 = __importDefault(require('./app'))
const logger_1 = __importDefault(require('../config/logger'))
app_1.default.listen(process.env.PORT, () => {
  logger_1.default.info(`Server is running on port:${process.env.PORT}`)
})
//# sourceMappingURL=server.js.map
