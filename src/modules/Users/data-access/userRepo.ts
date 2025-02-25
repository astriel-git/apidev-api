// src/modules/Users/data-access/userRepo.ts
import prisma from '../../../config/prismaClient.ts';
import bcrypt from 'bcrypt';
import { PrismaClientError, UnauthorizedError, TokenExpiredError } from '../../../core/errors/customErrors.ts';
import { Prisma } from '@prisma/client';
import { createToken } from '../../../core/auth/jwt.ts';
import crypto from 'crypto';
import type * as UserRequests from '../types/user.requests.ts';
import type * as UserResponses from '../types/user.responses.ts';

const SALT_ROUNDS = 10;

export const user = {
  async login(dados: UserRequests.LoginRequest): Promise<UserResponses.LoginResponse> {
    try {
      const identifier = dados.identificador;
      const loginRecord = await prisma.user.findFirst({
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

      if (!loginRecord) {
        throw new Error('Invalid credentials here 2');
      }

      const isPasswordValid = await bcrypt.compare(dados.senha, loginRecord.senha);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials here 3');
      }

      const userWithoutPassword: UserResponses.UserWithoutPassword = {
        userid: Number(loginRecord.userid),
        role: loginRecord.role,
        nome: loginRecord.nome,
        email: loginRecord.email,
        cpf: loginRecord.cpf,
      };

      const tokenObj = createToken(userWithoutPassword);
      return { token: tokenObj, user: userWithoutPassword};
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  async register(dados: UserRequests.RegisterRequest): Promise<UserResponses.RegisterResponse> {
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
      const registeredUser: UserResponses.RegisterResponse = {
        userid: newUser.userid,
        role: newUser.role,
        nome: newUser.nome,
        email: newUser.email,
        cpf: newUser.cpf,
      };
      return registeredUser;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  async recoverPassword( dados: UserRequests.RecoverPasswordRequest ): Promise<UserResponses.RecoverPasswordResponse> {
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
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  async resetPassword(dados: UserRequests.ResetPasswordRequest): Promise<{ message: string }> {
    try {
      const recoveryRecord = await prisma.recuperacao.findUnique({
        where: { token: dados.token },
      });
      if (!recoveryRecord) {
        throw new UnauthorizedError('Invalid or expired token.');
      }

      if (new Date() > recoveryRecord.expiracao) {
        throw new UnauthorizedError('Recovery token has expired.');
      }

      const hashedPassword = await bcrypt.hash(dados.newPassword, SALT_ROUNDS);
      await prisma.user.update({
        where: { userid: recoveryRecord.userid },
        data: { senha: hashedPassword },
      });
      await prisma.recuperacao.delete({
        where: { id: recoveryRecord.id },
      });

      return { message: 'Password reset successfully.' };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  async validatePasswordResetRequest(dados: UserRequests.ValidatePasswordResetRequest): Promise<void> {
    try {
      const recoveryRecord = await prisma.recuperacao.findUnique({
        where: { token: dados.token },
      });
      if (!recoveryRecord) {
        throw new UnauthorizedError('Invalid token.');
      }
      if (new Date() > recoveryRecord.expiracao) {
        throw new TokenExpiredError('Recovery token has expired.');
      }
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },
};
