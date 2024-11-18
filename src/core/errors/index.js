// src/errors/index.js

class BaseError extends Error {
  constructor (message, httpCode = 500) {
    super(message)
    this.httpCode = httpCode
    Error.captureStackTrace(this, this.constructor) // Capture stack trace
  }
}

export class BadRequestError extends BaseError {
  constructor (message = 'Sintaxe invalida') {
    super(message, 400)
  }
}

export class UnauthorizedError extends BaseError {
  constructor (message = 'Usuário não autenticado.') {
    super(message, 401)
  }
}

export class ForbiddenError extends BaseError {
  constructor (message = 'Você não possui permissão para executar esta ação.') {
    super(message, 403)
  }
}

export class NotFoundError extends BaseError {
  constructor (message = 'Não foi possível encontrar este recurso no sistema.') {
    super(message, 404)
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor (message = 'Não foi possível realizar esta operação.') {
    super(message, 422)
  }
}

export class TooManyRequestsError extends BaseError {
  constructor (message = 'Você realizou muitas requisições recentemente.') {
    super(message, 429)
  }
}

export class InternalServerError extends BaseError {
  constructor (message = 'Um erro interno não esperado aconteceu.') {
    super(message, 500)
  }
}
