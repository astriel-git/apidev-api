// src/errors/errorHandler.js
import logger from '../utils/logger.js'
import sendMonitoringData from '../utils/monitoring.js'

class ErrorHandler {
  /**
   * Handles the error by logging it, sending monitoring data, and optionally responding.
   * @param {Error} error - The error to handle.
   * @param {Object} responseStream - (Optional) Express response object to send error status.
   */
  async handleError (error, responseStream = null) {
    await logger.logError(error) // Log error details
    await sendMonitoringData(error) // Send monitoring data

    if (error.isCritical) {
      process.exit(1) // Optionally exit on critical errors
    } else if (responseStream) {
      responseStream.status(error.statusCode || 500).json({ message: error.message })
    }
  }

  /**
   * Checks if the error is trusted and non-critical.
   * @param {Error} error
   * @returns {boolean} - True if the error is non-critical.
   */
  isTrustedError (error) {
    return !error.isCritical // Simple check for trusted errors
  }
}

export default new ErrorHandler()
