import { pacote } from '../data-access/pacoteRepo.ts';
import { PrismaClientError } from '../../../core/errors/customErrors.ts';
import type * as PacoteInterface from '../types/pacoteTypes.ts';

export const listPacotes = async (): Promise<PacoteInterface.ListResponse[]> => {
  try {
    const packageList = await pacote.list();
    if (!packageList) {
      throw new Error('Could not retrieve list of packages.');
    }
    return packageList;
  } catch (error: unknown) {
    if (error instanceof PrismaClientError) {
        throw new Error('User already exists.'); 
      }
    }
    throw Error;
};

