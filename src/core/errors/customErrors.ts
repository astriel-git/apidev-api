/**
 * Base class for custom errors.
 * @extends Error
 */
export class BaseError extends Error {
  public statusCode: number;

  /**
   * Creates a new BaseError instance.
   * @param message - The error message.
   * @param statusCode - HTTP status code (default is 500).
   */
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    // Capture the stack trace (available in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error for invalid requests.
 * @extends BaseError
 */
export class BadRequestError extends BaseError {
  /**
   * Creates a new BadRequestError instance.
   * @param message - Optional custom error message (default: 'Sintaxe invalida').
   */
  constructor(message: string = 'Sintaxe invalida') {
    super(message, 400);
  }
}

/**
 * Error for unauthorized access.
 * @extends BaseError
 */
export class UnauthorizedError extends BaseError {
  /**
   * Creates a new UnauthorizedError instance.
   * @param message - Optional custom error message (default: 'Usuário não autenticado.').
   */
  constructor(message: string = 'Usuário não autenticado.') {
    super(message, 401);
  }
}

/**
 * Error for forbidden actions.
 * @extends BaseError
 */
export class ForbiddenError extends BaseError {
  /**
   * Creates a new ForbiddenError instance.
   * @param message - Optional custom error message (default: 'Você não possui permissão para executar esta ação.').
   */
  constructor(message: string = 'Você não possui permissão para executar esta ação.') {
    super(message, 403);
  }
}

/**
 * Error when a resource is not found.
 * @extends BaseError
 */
export class NotFoundError extends BaseError {
  /**
   * Creates a new NotFoundError instance.
   * @param message - Optional custom error message (default: 'Não foi possível encontrar este recurso no sistema.').
   */
  constructor(message: string = 'Não foi possível encontrar este recurso no sistema.') {
    super(message, 404);
  }
}

/**
 * Error for unprocessable entities.
 * @extends BaseError
 */
export class UnprocessableEntityError extends BaseError {
  /**
   * Creates a new UnprocessableEntityError instance.
   * @param message - Optional custom error message (default: 'Não foi possível realizar esta operação.').
   */
  constructor(message: string = 'Não foi possível realizar esta operação.') {
    super(message, 422);
  }
}

/**
 * Error for too many requests.
 * @extends BaseError
 */
export class TooManyRequestsError extends BaseError {
  /**
   * Creates a new TooManyRequestsError instance.
   * @param message - Optional custom error message (default: 'Você realizou muitas requisições recentemente.').
   */
  constructor(message: string = 'Você realizou muitas requisições recentemente.') {
    super(message, 429);
  }
}

/**
 * Error for internal server errors.
 * @extends BaseError
 */
export class InternalServerError extends BaseError {
  /**
   * Creates a new InternalServerError instance.
   * @param message - Optional custom error message (default: 'Um erro interno não esperado aconteceu.').
   */
  constructor(message: string = 'Um erro interno não esperado aconteceu.') {
    super(message, 500);
  }
}

/**
 * Error for password reset tokens being attempted past their expiration date.
 * @extends BaseError
 */
export class TokenExpiredError extends BaseError {
  /**
   * Creates a new TokenExpiredError instance.
   * @param message - Optional custom error message (default: 'Um erro interno não esperado aconteceu.').
   */
  constructor(message: string = 'Token de recuperação expirado.') {
    super(message, 500);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Error for unique constraint violations.
 * @extends BaseError
 */
export class ConstraintError extends BaseError {
  /**
   * Creates a new ConstraintError instance. Used for unique constraint violations, during new user registration.
   * @param uniqueConstraint - The constraint identifier that was violated.
   * @param message - Optional custom error message (default: 'Chave única já cadastrada').
   */
  constructor(uniqueConstraint: string, message: string = 'Chave única já cadastrada') {
    super(`${message}: (${uniqueConstraint})`, 500);
  }
}

/**
 * Error for Prisma client errors.
 * @extends BaseError
 */
export class PrismaClientError extends BaseError {
  public details: any;

  /**
   * Creates a new PrismaClientError instance.
   * @param prismaError - The original Prisma error object.
   */
  constructor(prismaError: any) {
    super('Database Error', 500);
    this.details = prismaError;
  }
}
