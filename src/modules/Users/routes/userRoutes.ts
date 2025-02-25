// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from '../../../core/errors/customErrors.ts';
import type * as UserRequests from '../types/user.requests.ts';
import type * as UserResponses from '../types/user.responses.ts';
import { ApiResponse } from '../types/user.responses.ts';
import * as user from '../services/userService.ts';

const router = express.Router();

router.post(
  '/login',
  async (
    req: Request<UserRequests.LoginRequest>, 
    res: Response<ApiResponse<UserResponses.LoginResponse>>, 
    next: NextFunction): Promise<void> => {
    try {
      const result = await user.loginUser(req.body);
      res.status(200).json({ data: result, status: 'success', message: 'Login efetuado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/register',
  async (
    req: Request<UserRequests.RegisterRequest>,
    res: Response<ApiResponse<UserResponses.RegisterResponse>>,
    next: NextFunction): Promise<void> => {
    try {
      const result = await user.registerUser(req.body);
      res.status(201).json({ data: result, status: 'success', message: 'Usuário registrado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/recuperar',
  async (
    req: Request<UserRequests.RecoverPasswordRequest>, 
    res: Response<ApiResponse<UserResponses.RecoverPasswordResponse>>, 
    next: NextFunction): Promise<void> => {
    try {
      await user.recoverPassword(req.body);
      res.status(201).json({status: 'success', message: 'Email de recuperação enviado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/reset',
  async (
    req: Request<UserRequests.ResetPasswordRequest>, 
    res: Response<ApiResponse<UserResponses.ResetPasswordResponse>>, 
    next: NextFunction): Promise<void> => {
    try {
      await user.resetPassword(req.body);
      res.status(201).json({status: 'success', message: 'Email de recuperação enviado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/validate-reset',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.query as { token?: string };
      if (!token) {
        throw new Error('Token is required.');
      }
      await user.validateResetPassword({ token });
      res.json({ valid: true });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.json({ valid: false, expired: true, message: error.message });
      }
      next(error);
    }
  }
);


export default router;
