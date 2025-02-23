import pkg from 'jsonwebtoken';
import { secretKey } from '../auth/jwt.ts';
import { Request, Response, NextFunction } from 'express';

const { verify } = pkg;

// Extend the Express Request interface to include a "user" property.
interface AuthenticatedRequest extends Request {
  user?: any;
}

export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = verify(token.replace('Bearer ', ''), secretKey);
    // Place the decoded token data onto req.user
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = { ...decoded };
    } else {
      throw new Error('Invalid token payload');
    }
    next();
  } catch (err: any) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
