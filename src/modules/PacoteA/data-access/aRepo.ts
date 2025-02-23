// src/modules/PacoteA/data-access/aRepo.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const aPacote = {
  async pacoteAservice(cnpjbasico: string): Promise<string | null> {
    const result = await prisma.empresas.findFirst({
      select: {
        razaosocial: true,
      },
      where: {
        cnpjbasico,
      },
    });
    return result ? result.razaosocial : null;
  }
};
