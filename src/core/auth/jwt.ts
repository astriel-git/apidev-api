import pkg from 'jsonwebtoken'
// import type * as UserTypes from '../../modules/Users/types/user.dto.ts';
import type * as UserResponses from '../../modules/Users/types/user.responses.ts';

const { sign } = pkg

export const secretKey = process.env.SECRET_KEY || 'L1337-P07!#HK.'

/**
 * Creates a JWT token for the user.
 * @param {UserWithoutPassword} user - The user object without sensitive information.
 * @returns {TokenResponse} An object containing the token.
 */

export function createToken(user: UserResponses.UserWithoutPassword): UserResponses.TokenResponse {
  if (!user) {
    throw new Error('User not provided');
  }
  const payload = {
    sub: user.userid,
    name: user.nome,
    email: user.email,
    role: user.role,
  };

  // Sign the token with a 2-hour expiration
  const token = sign(payload, secretKey, { expiresIn: '2h' });

  return { token } ;
}
