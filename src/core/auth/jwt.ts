import pkg from 'jsonwebtoken'
import type * as UserInterface from '../../modules/Users/types/userTypes.ts';

const { sign, verify, decode } = pkg

export const secretKey = process.env.SECRET_KEY || 'L1337-P07!#HK.'

/**
 * Creates a JWT token for the user.
 * @param {PublicUser} user - The user object without sensitive information.
 */

export function createToken(user: UserInterface.PublicUser): { token: string; exp: number } {
  if (!user) {
    
    throw new Error('User not provided');
    }
    const payload = {
      name: user.nome,
    };

    // Sign the token with a 2-hour expiration
    const token = sign(payload, secretKey, { expiresIn: '2h' });
    const decoded = decode(token) as { exp: number };

    return { token, exp: decoded.exp };

  }

  export function verifyToken(token: string): UserInterface.PublicUser {
      const payload = verify(token, secretKey) as UserInterface.PublicUser;
      return payload;
  }
