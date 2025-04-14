// src/modules/Pacotes/types/PacoteTypes.ts

// // Pacote REQUEST type interfaces

// /**
//  * Data Transfer Object for user login.
//  * @param {string} nome - User's full name
//  * @param {string} email - User's CPF or email address.
//  * @param {string} senha - User's password.
//  * @param {string} cpf - User's CPF document number.
//  * @param {string} cnpj - User's CNPJ document number.
//  * @param {Date} datanascimento - User's date of birth.
//  * @param {string} razaosocial - User's Razão Social (business name).
//  */
// export interface RegisterRequest {
//   nome: string;
//   email: string;
//   senha: string;
//   cpf: string;
//   cnpj?: string;
//   datanascimento: Date;
//   razaosocial?: string;
// }

// Pacote RESPONSE type interfaces

/**
 * Final wrapper for all Pacote Responses.
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
 * Response type returned for all active Pacotes.
 * This is typically the user object without the password.
 * @param {bigint} idpacote - The "pacote's ID".
 * @param {string} nome - The pacote's name.
 * @param {string} descricao - A short description of the pacote.
 * @param {number} valor - The monetary value of a single use of the pacote.
 * @param {Array<string>} features - An array of features for the pacote.
 * @param {string} ativo - Whether this pacote is currently active for sale or for use.
 */
export interface ListResponse {
  idpacote:   string;
  nome:       string;
  descricao:  string;
  valor:      number;
  features:   Array<string>;
  ativo:      boolean;
}


