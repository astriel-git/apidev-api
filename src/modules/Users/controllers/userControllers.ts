// src/modules/Users/controllers/userController.ts
import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.ts';
import type * as UserInterface from '../types/userTypes.ts';
import { TokenExpiredError } from '../../../core/errors/customErrors.ts';

export const loginUser = async (
  req: Request<UserInterface.LoginRequest>,
  res: Response<UserInterface.ApiResponse<UserInterface.LoginResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json({ response: result, status: 'success', message: 'Login efetuado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<UserInterface.RegisterRequest>,
  res: Response<UserInterface.ApiResponse<UserInterface.RegisterResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json({ response: result, status: 'success', message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export const recoverPassword = async (
  req: Request<UserInterface.RecoverPasswordRequest>,
  res: Response<UserInterface.ApiResponse<UserInterface.RecoverPasswordResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.recoverPassword(req.body);
    res.status(201).json({ status: 'success', message: 'Email de recuperação enviado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request<UserInterface.ResetPasswordRequest>,
  res: Response<UserInterface.ApiResponse<UserInterface.ResetPasswordResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.resetPassword(req.body);
    res.status(201).json({ status: 'success', message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

export const validateReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) {
      throw new Error('Token is required.');
    }
    await userService.validateResetPassword({ token });
    res.json({ valid: true });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.json({ valid: false, expired: true, message: error.message });
    }
    next(error);
  }
};
