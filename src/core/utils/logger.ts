// src/utils/logger.ts
const logger = {
  async logError(error: Error): Promise<void> {
    // Log the error to the console for now
    console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`);
    console.error(error.stack);
  }
};

export default logger;
