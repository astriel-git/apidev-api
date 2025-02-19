// src/utils/monitoring.js
const sendMonitoringData = async (error) => {
  // Placeholder: log to the console for now
  console.log('Simulating sending error data to a monitoring service:', {
    name: error.name,
    message: error.message,
    isCritical: error.isCritical || false
  })
  // Add logic later to send this data to a real service
}

export default sendMonitoringData
