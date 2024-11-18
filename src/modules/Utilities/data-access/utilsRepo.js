import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const aPacote = {
  async pacoteAservice (cnpjBasico) {
    // const result = await prisma.$queryRaw`
    //   SELECT "razaoSocial" FROM "empresas" WHERE "cnpjBasico" = ${cnpjBasico}
    // `

    const result = await prisma.empresas.findFirst({
      select: {
        razaoSocial: true
      },
      where: {
        cnpjBasico
      }
    })

    // if (result.length === 0) {
    //   return null
    // }
    return result.razaoSocial
  }
}
