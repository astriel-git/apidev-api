// src/errors/errorMiddleware.js
import { BaseError } from './customErrors.js'
import logger from '../utils/logger.js'
import { Prisma } from '@prisma/client'

/**
 * Express error-handling middleware
 * @type {import('express').ErrorRequestHandler}
 */
export async function errorMiddleware (err, req, res, next) {
  console.error('Error caught in middleware:', err)
  logger.error(err)

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {})
    })
  }

  // Handle Prisma Client Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(500).json({
      status: 'error',
      message: 'Database request error',
      code: err.code,
      details: err.meta || {}
    })
  }

  // Default 500 Server Error
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
}
