// src/core/errors/errorMiddleware.ts
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError } from './customErrors.ts';
import logger from '../utils/logger.ts';
import { Prisma } from '@prisma/client';

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Log the error using the logger.
  logger.error(err instanceof Error ? err : new Error(String(err)));
  
  // If the error is a known custom error, send its message and status code.
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }
  
  // Special handling for Prisma Client errors.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(500).json({
      status: 'error',
      message: 'Database request error',
      code: err.code,
      details: err.meta || {},
    });
    return;
  }
  
  // For any other unknown errors, respond with a generic internal server error.
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : String(err),
  });
};
