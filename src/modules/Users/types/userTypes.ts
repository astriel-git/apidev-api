// src/modules/Users/types/UserTypes.ts

// USER REQUEST TYPE INTERFACES

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

// USER RESPONSE TYPE INTERFACES

// src/modules/Users/types/user.response.ts

/**
 * Final wrapper for all user Responses.
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
 * Response type returned by the login function.
 * @param {Object} token - The user's jwt token object.
 * @param {Object} user - The user's details objects.
 */
export interface LoginResponse {
  token:  string;
  exp:    number;
  user:   PublicUser;
}

/**
 * Response type returned when a new user is registered.
 * This is typically the user object without the password.
 * @param {bigint} iduser - The user's ID.
 * @param {string} nome - The user's name.
 * @param {string} email - The user's email.
 * @param {string} role - The user's role.
 * 
 */
export interface RegisterResponse {
  iduser:   string;
  nome:     string;
  email:    string;
  role:     string;
  cpf:      string;
  
}

/**
 * Response type returned by the recoverPassword function.
 * @param {string} recoveryToken - The password recovery token.
 * @param {string} resetLink - The password reset link.
 */
export interface RecoverPasswordResponse {
  recoveryToken: string;
  resetLink: string;
}

/**
 * Response type returned by the resetPassword function.
 * @param {string} message - A message indicating the status of the password reset operation.
 */
export interface ResetPasswordResponse {
  message?: string;
}

/**
 * Response type returned by the resetPassword function.
 * @param {string} message - A message indicating the status of the password reset operation.
 */
export interface ValidatePasswordResetResponse {
  message?: string;
}

// GENERIC USER TYPE INTERFACES

/**
 * Represents a user object without sensitive information like the password.
 * @param {number} iduser - The user's ID.
 * @param {string} nome - The user's name.
 * @param {string} email - The user's email.
 * @param {string} role - The user's role.
 */
export interface PublicUser {
  iduser: number;
  role: string;
  nome: string;
}