// src/modules/Users/data-access/userRepo.ts
import prisma from '../../../config/prismaClient.ts';
import { PrismaClientError} from '../../../core/errors/customErrors.ts';
import { Prisma } from '@prisma/client';
import type * as PacoteInterface from '../types/pacoteTypes.ts';

export const pacote = {

  async list(): Promise<PacoteInterface.ListResponse[]> {
    try {
      const pacotesAtivos = await prisma.pacote.findMany({
        where: {
          ativo: true
        },
        select: {
          idpacote: true,
          nome: true,
          descricao: true,
          features: true,
          valor: true,
          ativo: true,
        }
      });
      return pacotesAtivos;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  }
};