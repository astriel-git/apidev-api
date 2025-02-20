/**
 * Base class for custom errors.
 * @extends Error
 */
export class BaseError extends Error {
  /**
   * Creates a new BaseError instance.
   * @param {string} message - The error message.
   * @param {number} [statusCode=500] - HTTP status code.
   */
  constructor (message, statusCode = 500) {
    super(message)
    /** @type {number} */
    this.statusCode = statusCode // Use "statusCode" consistently
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error for invalid requests.
 * @extends BaseError
 */
export class BadRequestError extends BaseError {
  /**
   * Creates a new BadRequestError instance.
   * @param {string} [message='Sintaxe invalida'] - Optional custom error message.
   */
  constructor (message = 'Sintaxe invalida') {
    super(message, 400)
  }
}

/**
 * Error for unauthorized access.
 * @extends BaseError
 */
export class UnauthorizedError extends BaseError {
  /**
   * Creates a new UnauthorizedError instance.
   * @param {string} [message='Usuário não autenticado.'] - Optional custom error message.
   */
  constructor (message = 'Usuário não autenticado.') {
    super(message, 401)
  }
}

/**
 * Error for forbidden actions.
 * @extends BaseError
 */
export class ForbiddenError extends BaseError {
  /**
   * Creates a new ForbiddenError instance.
   * @param {string} [message='Você não possui permissão para executar esta ação.'] - Optional custom error message.
   */
  constructor (message = 'Você não possui permissão para executar esta ação.') {
    super(message, 403)
  }
}

/**
 * Error when a resource is not found.
 * @extends BaseError
 */
export class NotFoundError extends BaseError {
  /**
   * Creates a new NotFoundError instance.
   * @param {string} [message='Não foi possível encontrar este recurso no sistema.'] - Optional custom error message.
   */
  constructor (message = 'Não foi possível encontrar este recurso no sistema.') {
    super(message, 404)
  }
}

/**
 * Error for unprocessable entities.
 * @extends BaseError
 */
export class UnprocessableEntityError extends BaseError {
  /**
   * Creates a new UnprocessableEntityError instance.
   * @param {string} [message='Não foi possível realizar esta operação.'] - Optional custom error message.
   */
  constructor (message = 'Não foi possível realizar esta operação.') {
    super(message, 422)
  }
}

/**
 * Error for too many requests.
 * @extends BaseError
 */
export class TooManyRequestsError extends BaseError {
  /**
   * Creates a new TooManyRequestsError instance.
   * @param {string} [message='Você realizou muitas requisições recentemente.'] - Optional custom error message.
   */
  constructor (message = 'Você realizou muitas requisições recentemente.') {
    super(message, 429)
  }
}

/**
 * Error for internal server errors.
 * @extends BaseError
 */
export class InternalServerError extends BaseError {
  /**
   * Creates a new InternalServerError instance.
   * @param {string} [message='Um erro interno não esperado aconteceu.'] - Optional custom error message.
   */
  constructor (message = 'Um erro interno não esperado aconteceu.') {
    super(message, 500)
  }
}

/**
 * Error for unique contraint vaiolations.
 * @extends BaseError
 */
export class ConstraintError extends BaseError {
  /**
   * Creates a new ConstraintError instance. Used for unique constraint violations, during new user registration.
   * @param {string} uniqueConstraint
   * @param {string} [message]
   */
  constructor (uniqueConstraint, message = 'Chave única já cadastrada') {
    super(`${message}: (${uniqueConstraint})`, 500)
  }
}

/**
 * Error for Prisma client errors.
 * @extends BaseError
 */
export class PrismaClientError extends BaseError {
  /**
   * Creates a new PrismaClientError instance.
   * @param {Object} prismaError - The original Prisma error object.
   */
  constructor (prismaError) {
    super('Database Error', 500)
    /** @type {Object} */
    this.details = prismaError // Attach Prisma error details
  }
}
