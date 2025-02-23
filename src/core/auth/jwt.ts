// src/core/auth/jwt.js
import pkg from 'jsonwebtoken'
const { sign } = pkg

// Use an environment variable for the secret in production
export const secretKey = process.env.SECRET_KEY || 'L1337-P07!#HK.'

/**
 * Creates a JWT token for the user.
 * @param {Object} user - The user object.
 * @param {number} user.userid - The user's ID.
 * @param {string} user.nome - The user's name.
 * @param {string} user.email - The user's email.
 * @param {string} user.role - The user's role.
 * @returns {Object} An object containing the token.
 */
interface User {
  userid: number;
  nome: string;
  email: string;
  role: string;
}

interface TokenResponse {
  token: string;
}

export function createToken(user: User): TokenResponse {
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

  return { token };
}
