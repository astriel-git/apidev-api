// // Boiler REQUEST type interfaces

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

// // Boiler RESPONSE type interfaces

// /**
//  * Response type returned when a new user is registered.
//  * This is typically the user object without the password.
//  * @param {bigint} iduser - The user's ID.
//  * @param {string} nome - The user's name.
//  * @param {string} email - The user's email.
//  * @param {string} role - The user's role.
//  * 
//  */
// export interface RegisterResponse {
//   iduser:   string;
//   nome:     string;
//   email:    string;
//   role:     string;
//   cpf:      string;
  
// }
