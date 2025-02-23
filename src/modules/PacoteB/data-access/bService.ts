// src/modules/PacoteB/data-access/bService.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const bPacote = {
  async pacoteBservice(cnpjBasico: string): Promise<{ 
    razaoSocial: string; 
    nomeFantasia: string; 
    enderecoCompleto: string; 
  } | null> {
    const result: any[] = await prisma.$queryRaw`
      SELECT e."razaoSocial", 
             est."nomeFantasia",
             TRIM(
               CONCAT_WS(
                 ', ',
                 CONCAT(est."tipoLogradouro", ' ', est."logradouro"),
                 CONCAT('Nº ', est."numero"),
                 NULLIF(est."complemento", ''),
                 est."bairro",
                 CONCAT(mun."descricao", ' - ', est."uf")
               )
             ) || ' / ' || 
             CONCAT(SUBSTRING(est."cep", 1, 5), '-', SUBSTRING(est."cep", 6, 3)) AS "enderecoCompleto"
      FROM "empresas" e
      INNER JOIN "estabelecimentos" est ON e."cnpjBasico" = est."cnpjBasico"
      LEFT JOIN "municipios" mun ON est."municipio" = mun."codigo"
      WHERE e."cnpjBasico" = ${cnpjBasico}
    `;

    if (result.length === 0) {
      return null;
    }
    return {
      razaoSocial: result[0].razaoSocial,
      nomeFantasia: result[0].nomeFantasia,
      enderecoCompleto: result[0].enderecoCompleto
    };
  }
};
