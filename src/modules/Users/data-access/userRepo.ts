// src/modules/Users/data-access/userRepo.ts
import prisma from '../../../config/prismaClient.ts';
import bcrypt from 'bcrypt';
import { PrismaClientError, UnauthorizedError, TokenExpiredError } from '../../../core/errors/customErrors.ts';
import { Prisma } from '@prisma/client';
import { createToken } from '../../../core/auth/jwt.ts';
import crypto from 'crypto';
import type * as UserInterface from '../types/userTypes.ts';

const SALT_ROUNDS = 10;

export const user = {
  async login(dados: UserInterface.LoginRequest): Promise<UserInterface.LoginResponse> {
    try {
      const identifier = dados.identificador;
      const loginRecord = await prisma.user.findFirst({
        select: { iduser: true, role: true, nome: true, email: true, senha: true, cpf: true },
        where: { OR: [{ email: identifier }, { cpf: identifier }] },
      });
      if (!loginRecord) {
        throw new UnauthorizedError('CPF ou Email não cadastrados.');
      }
      const isPasswordValid = await bcrypt.compare(dados.senha, loginRecord.senha);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Senha Incorreta');
      }
      const publicUser: UserInterface.PublicUser = {
        iduser: Number(loginRecord.iduser),
        role: loginRecord.role,
        nome: loginRecord.nome,
      };
      const tokenObj = createToken(publicUser);
      return { token: tokenObj.token, exp: tokenObj.exp, user: publicUser };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  async register(dados: UserInterface.RegisterRequest): Promise<UserInterface.RegisterResponse> {
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
      const registeredUser: UserInterface.RegisterResponse = {
        iduser: newUser.iduser,
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

  async recoverPassword( dados: UserInterface.RecoverPasswordRequest ): Promise<UserInterface.RecoverPasswordResponse> {
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
          user: { connect: { iduser: userFound.iduser } },
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

  async resetPassword(dados: UserInterface.ResetPasswordRequest): Promise<{ message: string }> {
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
        where: { iduser: recoveryRecord.userid },
        data: { senha: hashedPassword },
      });
      await prisma.recuperacao.delete({
        where: { idrecuperacao: recoveryRecord.idrecuperacao },
      });

      return { message: 'Password reset successfully.' };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  },

  async validatePasswordResetRequest(dados: UserInterface.ValidatePasswordResetRequest): Promise<void> {
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
