// src/core/errors/errorHandler.ts
import type { Request, Response } from 'express';
import type { MonitoredError } from '../utils/monitoring.ts';
import logger from '../utils/logger.ts';
import sendMonitoringData from '../utils/monitoring.ts';



interface CustomError extends Error {
  isCritical?: boolean;
  statusCode?: number;
}

export class ErrorHandler {
  async handleError(error: CustomError, req?: Request, res?: Response): Promise<void> {
    const errorId = Math.random().toString(36).substring(2, 15);
    logger.error(`ErrorID: ${errorId} - ${error.message}`, {
      error,
      path: req?.path,
      method: req?.method,
    });
    const monitoredError: MonitoredError = {
      error,
      errorId,
      path: req?.path,
      method: req?.method,
    };
    await sendMonitoringData(monitoredError);
    if (error.isCritical) process.exit(1);
    if (res) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        status: 'error',
        errorId,
        message: process.env.NODE_ENV === 'production' && statusCode === 500
          ? 'Internal Server Error'
          : error.message,
      });
    }
  }

  isTrustedError(error: CustomError): boolean {
    return !error.isCritical;
  }
}

export default new ErrorHandler();
