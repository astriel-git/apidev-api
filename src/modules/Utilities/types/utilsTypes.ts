// src/modules/Users/types/UserTypes.ts

// USER REQUEST TYPE INTERFACES

/**
 * Request Object for retriving the categories available in a given date.
 * @param {Object} date - The date, for the categories we need.
 */
export interface ParseCategoriesRequest {
  date:  string;
}

/**
 * Request Object for retriving the categories available in a given date.
 * @param {Object} category - The date, for the categories we need.
 */
export interface DownloadFilesRequest {
  category:  string;
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
 * @param {Object} date - The user's jwt token object.
 */
export interface FetchDateResponse {
  date:  string;
}

/**
 * Response type returned by the login function.
 * @param {Object} date - The user's jwt token object.
 */
export interface ParseCategoriesResponse {
  date:  string;
}

/**
 * Request Object for retriving the categories available in a given date.
 * @param {Object} category - The date, for the categories we need.
 * @param {Object} date - The date, for the categories we need.
 */
export interface DownloadFilesResponse {
  category:  string[];
  date:  string;
}

// GENERIC USER TYPE INTERFACES

// /**
//  * Represents a user object without sensitive information like the password.
//  * @param {number} iduser - The user's ID.
//  * @param {string} nome - The user's name.
//  * @param {string} email - The user's email.
//  * @param {string} role - The user's role.
//  */
// export interface PublicUser {
//   iduser: number;
//   role: string;
//   nome: string;
// }