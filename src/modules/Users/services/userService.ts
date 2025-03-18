// src/modules/Users/services/userService.ts
import { user } from '../data-access/userRepo.ts';
import { UnauthorizedError, BadRequestError, ConstraintError, PrismaClientError } from '../../../core/errors/customErrors.ts';
import { verifyRecaptcha } from '../../../core/middlewares/recaptcha-enterprise.ts';
import { sendRecoveryEmail } from '../../../core/utils/email.ts';
import type * as UserInterface from '../types/userTypes.ts';

export const loginUser = async (dados: UserInterface.LoginRequest): Promise<UserInterface.LoginResponse> => {
  if (!dados.identificador || !dados.senha) {
    throw new BadRequestError('Email and senha are required.');
  }

  if (!dados.recaptchaToken) {
    throw new BadRequestError('reCAPTCHA token is required.');
  }

  const riskScore = await verifyRecaptcha({
    projectID: 'api-dev-449113',
    recaptchaSiteKey: '6LfNsMQqAAAAAERKXwTN55arWWIZ_QVjhLnkLWvW',
    recaptchaAction: 'login',
    token: dados.recaptchaToken,
  });

  if (riskScore < 0.5) {
    throw new UnauthorizedError('reCAPTCHA verification failed. Suspicious activity detected.');
  }

  const result = await user.login(dados);

  if (!result.user) {
    throw new UnauthorizedError('Invalid credentials here.');
  }
  
  console.log('This is for fine-tuning the Response interfaces - LoginResponse', result);

  return result;
};

export const registerUser = async (dados: UserInterface.RegisterRequest): Promise<UserInterface.RegisterResponse> => {
  if (!dados.nome || !dados.email || !dados.senha) {
    throw new BadRequestError('Name, email, and senha are required.');
  }

  try {
    const newUser = await user.register(dados);
    if (!newUser) {
      throw new Error('User could not be registered.');
    }
    return newUser;
  } catch (error: unknown) {
    if (error instanceof PrismaClientError) {
        throw new ConstraintError('User already exists.'); 
      }
    }
    throw Error;
};

export const recoverPassword = async (dados: UserInterface.RecoverPasswordRequest): Promise<UserInterface.RecoverPasswordResponse> => {
  if (!dados.email || !dados.cpf) {
    throw new BadRequestError('Email and CPF are required.');
  }

  try {
    const result = await user.recoverPassword(dados);
    const frontendUrl = process.env.FRONTEND_URL;
    const resetLink = `${frontendUrl}/#/reset-password?token=${result.recoveryToken}`;

    await sendRecoveryEmail(dados.email, resetLink);

    return { recoveryToken: result.recoveryToken, resetLink };
  } catch (error: unknown) {
    if (error) {
      throw new UnauthorizedError('User not found.');
    }
    throw error;
  }
};


export const resetPassword = async (dados: UserInterface.ResetPasswordRequest): Promise<UserInterface.RecoverPasswordResponse> => {
  if (!dados.token || !dados.newPassword) {
    throw new BadRequestError('Token and new password are required.');
  }
  await user.resetPassword(dados)

  return { recoveryToken: dados.token, resetLink: 'Password reset successfully.' };
};

export const validateResetPassword = async (dados: UserInterface.ValidatePasswordResetRequest): Promise<UserInterface.ValidatePasswordResetResponse> => {
  if (!dados.token) {
    throw new BadRequestError('Token is required.');
  }
  await user.validatePasswordResetRequest(dados);
  return { message: 'Token Valid.' };
};
