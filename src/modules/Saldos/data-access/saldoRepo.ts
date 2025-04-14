// src/modules/Users/data-access/userRepo.ts
import prisma from '../../../config/prismaClient.ts';
import { PrismaClientError} from '../../../core/errors/customErrors.ts';
import { Prisma } from '@prisma/client';
import type * as SaldoInterface from '../types/saldoTypes.ts';

export const saldo = {

  async userSaldos(dados: SaldoInterface.UserSaldoRequest): Promise<SaldoInterface.UserSaldoResponse[]> {
    console.log('dados', dados);
    try {
      const userSaldoRaw = await prisma.saldo.findMany({
        where: {
          userid: dados.userid,
        },
        select: {
          saldo: true,
          userid: true,
          pacoteid: true,
          pacote: {
            select: {
              nome: true,
            }
          }
        }
      });

      const userSaldo = userSaldoRaw.map(item => ({
        ...item,
        pacote: item.pacote.nome,
      }));

      console.log('userSaldo', userSaldo);
      return userSaldo;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error);
      }
      throw error;
    }
  }
};
