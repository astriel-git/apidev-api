// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from '../../../core/errors/customErrors.ts';

const router = express.Router();

import {
  loginUser,
  registerUser,
  recoverPassword,
  resetPassword,
  validateResetPassword
} from '../services/userService.ts';

interface LoginRequestBody {
  identificador: string;
  senha: string;
}

interface RegisterRequestBody {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnpj?: string;
  datanascimento: Date | string;
  razaosocial?: string;
}

interface RecoverPasswordRequestBody {
  email: string;
  cpf: string;
}

interface ResetPasswordRequestBody {
  token: string;
  newPassword: string;
}

interface ValidateResetRequestBody {
  token: string;
}


router.post(
  '/login',
  async (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, login } = await loginUser(req.body);
      res.status(200).json({ token, user: login });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/register',
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newUser = await registerUser(req.body);
      res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: newUser });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/recuperar',
  async (req: Request<{}, {}, RecoverPasswordRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await recoverPassword(req.body);
      res.status(201).json({ message: 'Email de recuperação enviado com sucesso', result });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/reset',
  async (req: Request<{}, {}, ResetPasswordRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await resetPassword(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/validate-reset',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get the token from query parameters (since you're using GET)
      const { token } = req.query as { token?: string };
      if (!token) {
        throw new Error('Token is required.');
      }

      // Call your service; if token is expired, it will throw TokenExpiredError
      await validateResetPassword({ token });
      // If the token is valid, you might return an empty response or additional data
      res.json({ valid: true });
    } catch (error: any) {
      // If the error indicates the token is expired, return a special payload
      if (error instanceof TokenExpiredError) {
        res.json({ valid: false, expired: true, message: error.message });
      }
      next(error);
    }
  }
);


export default router;
