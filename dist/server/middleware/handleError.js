'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const handleError = (error, req, res) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message: message,
    data: data,
  })
}
exports.default = handleError
//# sourceMappingURL=handleError.js.map
