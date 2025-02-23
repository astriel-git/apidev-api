// src/errors/errorHandler.ts
import logger from '../utils/logger.ts';
import sendMonitoringData from '../utils/monitoring.ts';

interface CustomError extends Error {
  isCritical?: boolean;
  statusCode?: number;
}

class ErrorHandler {
  /**
   * Handles the error by logging it, sending monitoring data, and optionally responding.
   * @param error - The error to handle.
   * @param responseStream - (Optional) Express response object to send error status.
   */
  async handleError(error: CustomError, responseStream: any = null): Promise<void> {
    await logger.logError(error); // Log error details
    await sendMonitoringData(error); // Send monitoring data

    if (error.isCritical) {
      process.exit(1); // Optionally exit on critical errors
    } else if (responseStream) {
      responseStream.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  /**
   * Checks if the error is trusted and non-critical.
   * @param error - The error to check.
   * @returns True if the error is non-critical.
   */
  isTrustedError(error: CustomError): boolean {
    return !error.isCritical; // Simple check for trusted errors
  }
}

export default new ErrorHandler();
