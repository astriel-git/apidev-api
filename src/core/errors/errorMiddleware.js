// src/errors/errorMiddleware.js
import errorHandler from './errorHandler.js'
import { BaseError, InternalServerError } from './index.js' // Import InternalServerError

/**
 * Express error-handling middleware
 * @type {import('express').ErrorRequestHandler}
 */
export async function errorMiddleware (err, req, res, next) {
  console.error('Error caught in middleware:', err)

  try {
    if (err instanceof BaseError) {
      // Handle custom errors
      await errorHandler.handleError(err, res)
    } else {
      // Handle other errors as internal server errors
      await errorHandler.handleError(new InternalServerError(), res)
    }
  } catch (handlingError) {
    console.error('Error while handling error:', handlingError)
    res.status(500).send({ message: 'An unexpected error occurred' })
  }
}
