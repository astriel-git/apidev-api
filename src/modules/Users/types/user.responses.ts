// src/modules/Users/types/user.response.ts

/**
 * Final wrapper for all user Responses.
 * @param {number} data - Data wrapper with all returned data for a given route.
 * @param {string} status - Status message for the response.
 * @param {string} message - A descriptive message of the action that's been performed
 */
export interface ApiResponse<T> {
  data?: T;
  status?: string;
  message?: string;
}


/**
 * Represents a jwt token object.
 * @param {string} token - The user's jwt token object.
 */
export interface TokenResponse {
  token: string;
}

/**
 * Represents a user object without sensitive information like the password.
 * @param {number} userid - The user's ID.
 * @param {string} nome - The user's name.
 * @param {string} email - The user's email.
 * @param {string} role - The user's role.
 */
export interface UserWithoutPassword {
  userid: number;
  role: string;
  nome: string;
  email: string;
  cpf: string;
}

/**
 * Response type returned by the login function.
 * @param {Object} token - The user's jwt token object.
 * @param {Object} user - The user's details objects.
 */
export interface LoginResponse {
  token:  TokenResponse;
  user:   UserWithoutPassword;
}

/**
 * Response type returned when a new user is registered.
 * This is typically the user object without the password.
 * @param {bigint} userid - The user's ID.
 * @param {string} nome - The user's name.
 * @param {string} email - The user's email.
 * @param {string} role - The user's role.
 * 
 */
export interface RegisterResponse {
  userid:   bigint;
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

