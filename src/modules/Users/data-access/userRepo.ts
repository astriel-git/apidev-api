// src/modules/Users/data-access/userRepo.ts
import prisma from '../../../config/prismaClient.ts';
import bcrypt from 'bcrypt';
import { PrismaClientError, UnauthorizedError, TokenExpiredError } from '../../../core/errors/customErrors.ts';
import { Prisma } from '@prisma/client';
import { createToken } from '../../../core/auth/jwt.ts';
import crypto from 'crypto';
import type * as UserTypes from '../types/user.interface';

const SALT_ROUNDS = 10;

export const user = {
  /**
   * Attempts to find a user by credentials and returns an authentication token and user data (without password).
   *
   * @param {UserTypes.LoginData} dados - An object containing the login credentials.
   * @returns {Promise<any>} A promise that resolves with an object containing a token and user data.
   * @throws {Error} Throws an error if the credentials are invalid or if there is a Prisma client error.
   */
  async login(dados: UserTypes.LoginData): Promise<any> {
    try {
      const identifier = dados.identificador;
      const login = await prisma.user.findFirst({
        select: {
          userid: true,
          role: true,
          nome: true,
          email: true,
          senha: true,
          cpf: true,
        },
        where: {
          OR: [{ email: identifier }, { cpf: identifier }],
        },
      });

      if (!login || !(await bcrypt.compare(dados.senha, login.senha))) {
        throw new Error('Invalid credentials');
      }

      const { senha, ...userWithoutPassword } = login;
      const token = createToken({ ...userWithoutPassword, userid: Number(userWithoutPassword.userid) });
      return { token, login: userWithoutPassword };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  /**
   * Registers a new user by hashing the provided password and creating a user record in the database.
   *
   * @param {UserTypes.RegisterData} dados - An object containing the registration data.
   * @returns {Promise<any>} A promise that resolves with the newly created user object.
   * @throws {Error} Throws an error if the registration fails or if there is a Prisma client error.
   */
  async register(dados: UserTypes.RegisterData): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(dados.senha, SALT_ROUNDS);
      const newUser = await prisma.user.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf,
          cnpj: dados?.cnpj,
          senha: hashedPassword,
          datanascimento: dados.datanascimento,
          razaosocial: dados?.razaosocial,
        },
      });
      return newUser;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  /**
   * Generates a password recovery token, stores it with an expiration date, and builds a reset link.
   *
   * @param {UserTypes.RecoverPasswordData} dados - An object containing the user's email and CPF.
   * @returns {Promise<{ recoveryToken: string; resetLink: string }>} A promise that resolves with an object containing the recovery token and reset link.
   * @throws {Error} Throws an error if the user is not found or if there is a Prisma client error.
   */
  async recoverPassword(
    dados: UserTypes.RecoverPasswordData
  ): Promise<{ recoveryToken: string; resetLink: string }> {
    try {
      const userFound = await prisma.user.findFirst({
        where: {
          OR: [{ email: dados.email }, { cpf: dados.cpf }],
        },
      });
      if (!userFound) {
        throw new Error('User not found.');
      }

      const recoveryToken = crypto.randomBytes(20).toString('hex');
      const tokenExpires = new Date(Date.now() + 3600000); // 1 hour
      await prisma.recuperacao.create({
        data: {
          token: recoveryToken,
          expiracao: tokenExpires,
          user: { connect: { userid: userFound.userid } },
        },
      });
      const frontendUrl = process.env.FRONTEND_URL;
      const resetLink = `${frontendUrl}/#/reset-password?token=${recoveryToken}`;
      return { recoveryToken, resetLink };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  /**
   * Resets the user's password given a valid recovery token and a new password.
   *
   * @param {UserTypes.ResetPasswordData} param0 - An object containing the recovery token and new password.
   * @returns {Promise<{ message: string }>} A promise that resolves with a success message.
   * @throws {UnauthorizedError} Throws if the token is invalid, expired, or if there is a Prisma client error.
   */
  async resetPassword({ token, newPassword }: UserTypes.ResetPasswordData): Promise<{ message: string }> {
    try {
      const recoveryRecord = await prisma.recuperacao.findUnique({
        where: { token },
      });
      if (!recoveryRecord) {
        throw new UnauthorizedError('Invalid or expired token.');
      }

      if (new Date() > recoveryRecord.expiracao) {
        throw new UnauthorizedError('Recovery token has expired.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await prisma.user.update({
        where: { userid: recoveryRecord.userid },
        data: { senha: hashedPassword },
      });
      await prisma.recuperacao.delete({
        where: { id: recoveryRecord.id },
      });

      return { message: 'Password reset successfully.' };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  /**
   * Validates the provided password reset token by ensuring it exists and has not expired.
   *
   * @param {UserTypes.ValidateResetPasswordData} param0 - An object containing the recovery token.
   * @returns {Promise<void>} A promise that resolves if the token is valid.
   * @throws {UnauthorizedError | TokenExpiredError} Throws if the token is invalid or expired, or if there is a Prisma client error.
   */
  async validateResetPassword({ token }: UserTypes.ValidateResetPasswordData): Promise<void> {
    try {
      const recoveryRecord = await prisma.recuperacao.findUnique({
        where: { token },
      });
      if (!recoveryRecord) {
        throw new UnauthorizedError('Invalid token.');
      }
      if (new Date() > recoveryRecord.expiracao) {
        throw new TokenExpiredError('Recovery token has expired.');
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },
};
