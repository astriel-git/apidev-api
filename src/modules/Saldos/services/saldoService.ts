import { saldo } from '../data-access/saldoRepo.ts';
import { BadRequestError, ConstraintError, PrismaClientError } from '../../../core/errors/customErrors.ts';
import type * as SaldoInterface from '../types/saldoTypes.ts';

export const findSaldos = async (dados: SaldoInterface.UserSaldoRequest): Promise<SaldoInterface.UserSaldoResponse[]> => {
  if (!dados.userid) {
    throw new BadRequestError('Name, email, and senha are required.');
  }

  try {
    const saldoList = await saldo.userSaldos(dados);
    return saldoList;
  } catch (error: unknown) {
    if (error instanceof PrismaClientError) {
        throw new ConstraintError('User already exists.'); 
      }
    }
    throw Error;
};