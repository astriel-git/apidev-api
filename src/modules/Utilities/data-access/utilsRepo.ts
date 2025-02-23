import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const aPacote = {
  async pacoteAservice(cnpjBasico: string): Promise<string | null> {
    const result = await prisma.empresas.findFirst({
      select: {
        razaosocial: true,
      },
      where: {
        cnpjbasico: cnpjBasico,
      },
    });
    return result ? result.razaosocial : null;
  },
};
