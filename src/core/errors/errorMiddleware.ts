import express from 'express';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError } from './customErrors.ts';
import logger from '../utils/logger.ts';
import { Prisma } from '@prisma/client';

export const errorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    console.error('Error caught in middleware:', err);
    await logger.logError(err);

    if (err instanceof BaseError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    }

    // Handle Prisma Client Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        status: 'error',
        message: 'Database request error',
        code: err.code,
        details: err.meta || {}
      });
    }

    // Default 500 Server Error
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  })().catch(next);
};
