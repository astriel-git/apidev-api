// src/modules/Pacotes/types/SaldoTypes.ts

// // Saldo REQUEST type interfaces

/**
 * Data Transfer Object for user saldo requests.
 * @param {string} iduser - User's ID for fetching related Saldo data
 */
export interface UserSaldoRequest {
  userid: string;
}

// Pacote RESPONSE type interfaces

/**
 * Final wrapper for all Saldo Responses.
 * @param {number} data - Data wrapper with all returned data for a given route.
 * @param {string} status - Status message for the response.
 * @param {string} message - A descriptive message of the action that's been performed
 */

export interface ApiResponse<T> {
  response?: T;
  status?: string;
  message?: string;
}

/**
 * Response type returned for all active Saldos.
 * This is typically the user's saldo object.
 * @param {string} idpacote - The "pacote's ID".
 * @param {string} iduser - The pacote's name.
 * @param {number} saldo - A short description of the pacote.
 */
export interface UserSaldoResponse {
  pacoteid:   string;
  userid:     string;
  saldo:      number;
}


