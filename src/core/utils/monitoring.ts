// src/utils/monitoring.ts

export interface MonitoredError {
  error: Error & { isCritical?: boolean }; // extend Error with optional isCritical
  errorId: string;
  path?: string;
  method?: string;
}

const sendMonitoringData = async (monitoredError: MonitoredError): Promise<void> => {
  console.log('Sending monitoring data:', {
    errorId: monitoredError.errorId,
    name: monitoredError.error.name,
    message: monitoredError.error.message,
    isCritical: monitoredError.error.isCritical ?? false,
    path: monitoredError.path,
    method: monitoredError.method,
  });
  // Here you could integrate with a real monitoring service.
};

export default sendMonitoringData;
