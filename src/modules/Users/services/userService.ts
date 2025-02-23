// src/modules/Users/services/userService.ts
import { user } from '../data-access/userRepo.ts';
import { UnauthorizedError, BadRequestError, ConstraintError } from '../../../core/errors/customErrors.ts';
import { verifyRecaptcha } from '../../../core/middlewares/recaptcha-enterprise.ts';
import { sendRecoveryEmail } from '../../../core/utils/email.ts';

interface LoginData {
  identificador: string;
  senha: string;
  recaptchaToken?: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnpj?: string;
  datanascimento: Date | string;
  razaosocial?: string;
}

interface RecoverPasswordData {
  email: string;
  cpf: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const loginUser = async (dados: LoginData): Promise<any> => {
  console.log(dados);

  if (!dados.identificador || !dados.senha) {
    throw new BadRequestError('Email and senha are required.');
  }

  // Ensure the recaptcha token exists
  if (!dados.recaptchaToken) {
    throw new BadRequestError('reCAPTCHA token is required.');
  }

  // Verify reCAPTCHA using your helper function.
  // Adjust these values to match your Google Cloud settings.
  const riskScore = await verifyRecaptcha({
    projectID: 'api-dev-449113', // your Google Cloud project ID
    recaptchaSiteKey: '6LfNsMQqAAAAAERKXwTN55arWWIZ_QVjhLnkLWvW', // same key as used on the front-end
    recaptchaAction: 'login', // the action name you set on the front-end (e.g., "login")
    token: dados.recaptchaToken,
  });

  console.log(`reCAPTCHA risk score: ${riskScore}`);

  // Decide on a risk threshold; for example, reject if the score is below 0.5.
  if (riskScore < 0.5) {
    throw new UnauthorizedError('reCAPTCHA verification failed. Suspicious activity detected.');
  }

  const result = await user.login(dados);

  if (!result.login) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  return result;
};

export const registerUser = async (dados: RegisterData): Promise<any> => {
  if (!dados.nome || !dados.email || !dados.senha) {
    throw new BadRequestError('Name, email, and senha are required.');
  }

  try {
    const newUser = await user.register(dados);
    if (!newUser) {
      throw new Error('User could not be registered.');
    }
    return newUser;
  } catch (error: any) {
    if (error.details && error.details.code === 'P2002') {
      const uniqueConstraint = error.details.meta.target;
      throw new ConstraintError(uniqueConstraint);
    }
    throw error;
  }
};

export const recoverPassword = async (
  dados: RecoverPasswordData
): Promise<{ message: string }> => {
  if (!dados.email || !dados.cpf) {
    throw new BadRequestError('Email and CPF are required.');
  }

  try {
    // This finds the user, generates a token, updates the DB record, and logs the token.
    const result = await user.recoverPassword(dados);
    
    // Build the reset link. Adjust FRONTEND_URL in your .env as needed.
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    const resetLink = `${frontendUrl}/#/reset-password?token=${result.recoveryToken}`;

    console.log(`Sending recovery email to ${dados.email}`);
    console.log(`Recovery link: ${resetLink}`);

    // Send the recovery email using our Mailtrap-based function.
    await sendRecoveryEmail(dados.email, resetLink);

    return { message: 'Recovery email sent successfully.' };
  } catch (error: any) {
    if (error.message === 'User not found.') {
      throw new UnauthorizedError('User not found.');
    }
    throw error;
  }
};


export const resetPassword = async (
  dados: ResetPasswordData
): Promise<{ message: string }> => {
  if (!dados.token || !dados.newPassword) {
    throw new BadRequestError('Token and new password are required.');
  }
  return await user.resetPassword(dados.token, dados.newPassword);
};

export const validateResetPassword = async (
  dados: { token: string }
): Promise<{ message: string }> => {
  if (!dados.token) {
    throw new BadRequestError('Token is required.');
  }
  await user.validateResetPassword(dados.token);
  return { message: 'Token Valid.' };
};
