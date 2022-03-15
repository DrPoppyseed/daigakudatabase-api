import {
  BAD_REQUEST_ERROR_MESSAGE,
  BAD_VALUE_ERROR_MESSAGE,
  CANNOT_ACCESS_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  MISSING_TOKEN_ERROR_MESSAGE,
} from './constants'
import { toNumberIfNumeric } from './common'

export class SyntheticError extends Error {
  constructor(statusCode: number, message: string) {
    super(message)
    this.name = this.constructor.name
    this._statusCode = this.initStatusCode(statusCode)
    this._message = this.initMessage(message)
    Error.captureStackTrace(this, this.constructor)
  }

  private _statusCode: number

  get statusCode() {
    return this._statusCode
  }

  set statusCode(value: string | number) {
    this._statusCode = toNumberIfNumeric(value) || 500
  }

  private _message: string

  set message(value: string) {
    this._message = value
  }

  initStatusCode(value: string | number): number {
    return toNumberIfNumeric(value) || 500
  }

  initMessage(value: string): string {
    return value || INTERNAL_SERVER_ERROR_MESSAGE
  }
}

export class ResourceNotFoundError extends SyntheticError {
  constructor(resource?: string) {
    super(
      404,
      resource?.length
        ? `リソース ${resource} が見つかりませんでした。`
        : 'リソースが見つかりませんでした。'
    )
  }
}

export class ForbiddenError extends SyntheticError {
  constructor(message?: string) {
    super(403, getMessage(message, CANNOT_ACCESS_ERROR_MESSAGE))
  }
}

export class InternalError extends SyntheticError {
  constructor(message?: string) {
    super(500, getMessage(message, INTERNAL_SERVER_ERROR_MESSAGE))
  }
}

export class BadRequestError extends SyntheticError {
  constructor(message?: string) {
    super(400, getMessage(message, BAD_REQUEST_ERROR_MESSAGE))
  }
}

export class MissingTokenError extends SyntheticError {
  constructor(message?: string) {
    super(401, getMessage(message, MISSING_TOKEN_ERROR_MESSAGE))
  }
}

export class BadValueError extends SyntheticError {
  constructor(message?: string) {
    super(422, getMessage(message, BAD_VALUE_ERROR_MESSAGE))
  }
}

export const getMessage = (
  message: string | undefined,
  defaultMessage: string
): string => {
  return message === undefined ? defaultMessage : message
}
