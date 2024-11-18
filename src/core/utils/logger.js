// src/utils/logger.js
const logger = {
  async logError (error) {
    // Log the error to the console for now
    console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`)
    console.error(error.stack)
  }
}

export default logger
