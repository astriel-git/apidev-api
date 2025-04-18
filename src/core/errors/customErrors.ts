// src/core/errors/customErrors.ts

/**
 * Base class for custom errors.
 * @extends Error
 */
export class BaseError extends Error {
  public statusCode: number;
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
  constructor(message: string = 'Sintaxe invalida') {
    super(message, 400);
  }
}

/**
 * Error for unauthorized access.
 * @extends BaseError
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Usuário não autenticado.') {
    super(message, 401);
  }
}

/**
 * Error for forbidden actions.
 * @extends BaseError
 */
export class ForbiddenError extends BaseError {
  constructor(message: string = 'Você não possui permissão para executar esta ação.') {
    super(message, 403);
  }
}

/**
 * Error when a resource is not found.
 * @extends BaseError
 */
export class NotFoundError extends BaseError {
  constructor(message: string = 'Não foi possível encontrar este recurso no sistema.') {
    super(message, 404);
  }
}

/**
 * Error for unprocessable entities.
 * @extends BaseError
 */
export class UnprocessableEntityError extends BaseError {
  constructor(message: string = 'Não foi possível realizar esta operação.') {
    super(message, 422);
  }
}

/**
 * Error for too many requests.
 * @extends BaseError
 */
export class TooManyRequestsError extends BaseError {
  constructor(message: string = 'Você realizou muitas requisições recentemente.') {
    super(message, 429);
  }
}

/**
 * Error for internal server errors.
 * @extends BaseError
 */
export class InternalServerError extends BaseError {
  constructor(message: string = 'Um erro interno não esperado aconteceu.') {
    super(message, 500);
  }
}

/**
 * Error for password reset tokens that have expired.
 * @extends BaseError
 */
export class TokenExpiredError extends BaseError {
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
  constructor(uniqueConstraint: string, message: string = 'Chave única já cadastrada') {
    super(`${message}: (${uniqueConstraint})`, 500);
  }
}

/**
 * Error for Prisma client errors.
 * @extends BaseError
 */
export class PrismaClientError extends BaseError {
  public details: unknown;
  constructor(prismaError: unknown) {
    super('Database Error', 500);
    this.details = prismaError;
  }
}


export class UpstreamServerFailure extends BaseError {
  constructor(
    message: string = 'Falha ao obter dados de um serviço externo.'
  ) {
    // 502 Bad Gateway––since it's an upstream service failure
    super(message, 502);
    this.name = 'FetchDatesError';
  }
}