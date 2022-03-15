'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getMessage =
  exports.BadValueError =
  exports.MissingTokenError =
  exports.BadRequestError =
  exports.InternalError =
  exports.ForbiddenError =
  exports.ResourceNotFoundError =
  exports.SyntheticError =
    void 0
const constants_1 = require('./constants')
const common_1 = require('./common')
class SyntheticError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = this.constructor.name
    this._statusCode = this.initStatusCode(statusCode)
    this._message = this.initMessage(message)
    Error.captureStackTrace(this, this.constructor)
  }
  get statusCode() {
    return this._statusCode
  }
  set statusCode(value) {
    this._statusCode = (0, common_1.toNumberIfNumeric)(value) || 500
  }
  set message(value) {
    this._message = value
  }
  initStatusCode(value) {
    return (0, common_1.toNumberIfNumeric)(value) || 500
  }
  initMessage(value) {
    return value || constants_1.INTERNAL_SERVER_ERROR_MESSAGE
  }
}
exports.SyntheticError = SyntheticError
class ResourceNotFoundError extends SyntheticError {
  constructor(resource) {
    super(
      404,
      (resource === null || resource === void 0 ? void 0 : resource.length)
        ? `リソース ${resource} が見つかりませんでした。`
        : 'リソースが見つかりませんでした。'
    )
  }
}
exports.ResourceNotFoundError = ResourceNotFoundError
class ForbiddenError extends SyntheticError {
  constructor(message) {
    super(
      403,
      (0, exports.getMessage)(message, constants_1.CANNOT_ACCESS_ERROR_MESSAGE)
    )
  }
}
exports.ForbiddenError = ForbiddenError
class InternalError extends SyntheticError {
  constructor(message) {
    super(
      500,
      (0, exports.getMessage)(
        message,
        constants_1.INTERNAL_SERVER_ERROR_MESSAGE
      )
    )
  }
}
exports.InternalError = InternalError
class BadRequestError extends SyntheticError {
  constructor(message) {
    super(
      400,
      (0, exports.getMessage)(message, constants_1.BAD_REQUEST_ERROR_MESSAGE)
    )
  }
}
exports.BadRequestError = BadRequestError
class MissingTokenError extends SyntheticError {
  constructor(message) {
    super(
      401,
      (0, exports.getMessage)(message, constants_1.MISSING_TOKEN_ERROR_MESSAGE)
    )
  }
}
exports.MissingTokenError = MissingTokenError
class BadValueError extends SyntheticError {
  constructor(message) {
    super(
      422,
      (0, exports.getMessage)(message, constants_1.BAD_VALUE_ERROR_MESSAGE)
    )
  }
}
exports.BadValueError = BadValueError
const getMessage = (message, defaultMessage) => {
  return message === undefined ? defaultMessage : message
}
exports.getMessage = getMessage
//# sourceMappingURL=error.js.map
