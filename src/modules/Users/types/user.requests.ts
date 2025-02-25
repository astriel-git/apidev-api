// src/modules/Users/types/dto.ts


/**
 * Data Transfer Object for user login.
 * @param {string} identificador - The user's CPF or email address.
 * @param {string} senha - The user's password.
 * @param {string} recaptchaToken - Google Enterprise Recaptcha Token.
 */
export interface LoginRequest {
  identificador: string;
  senha: string;
  recaptchaToken?: string;
}

/**
 * Data Transfer Object for user login.
 * @param {string} nome - User's full name
 * @param {string} email - User's CPF or email address.
 * @param {string} senha - User's password.
 * @param {string} cpf - User's CPF document number.
 * @param {string} cnpj - User's CNPJ document number.
 * @param {Date} datanascimento - User's date of birth.
 * @param {string} razaosocial - User's Razão Social (business name).
 */
export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnpj?: string;
  datanascimento: Date;
  razaosocial?: string;
}

/**
 * Data Transfer Object for password recovery.
 * @param {string} email - User's CPF or email address.
 * @param {string} cpf - User's CPF document number.
 */
export interface RecoverPasswordRequest {
  email: string;
  cpf: string;
}

/**
 * Data Transfer Object for resetting a password.
 * @param {string} token - Password recovery token generated during password recovery.
 * @param {string} newPassword - User's newly created password.
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Data Transfer Object for validating a password reset token.
 * @param {string} token - Password recovery token generated during password recovery.
 */
export interface ValidatePasswordResetRequest {
  token: string;
}
