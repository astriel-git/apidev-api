// src/modules/PacoteC/data-access/cService.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cPacote = {
  async pacoteCservice(cnpjBasico: string): Promise<{ result: any } | null> {
    const result: any[] = await prisma.$queryRaw`
      SELECT e."razaoSocial", 
             COALESCE(est."nomeFantasia", 'NÃO INFORMADO') AS "nomeFantasia",
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
             CONCAT(SUBSTRING(est."cep", 1, 5), '-', SUBSTRING(est."cep", 6, 3)) AS "enderecoCompleto",
             COALESCE(est."correioEletronico", 'NÃO INFORMADO') AS "email",
             COALESCE(CONCAT(est."ddd1", ' ', SUBSTRING(est."telefone1", 1, 4), '-', SUBSTRING(est."telefone1", 5, 4)), 'NÃO INFORMADO') AS "telefoneCompletoUm",
             CASE
               WHEN est."ddd2" IS NOT NULL AND est."telefone2" IS NOT NULL THEN
                 CONCAT(est."ddd2", ' ', SUBSTRING(est."telefone2", 1, 4), '-', SUBSTRING(est."telefone2", 5, 4))
               ELSE 'NÃO INFORMADO'
             END AS "telefoneCompletoDois",
             COALESCE(CONCAT('(', est."dddFax", ') ', SUBSTRING(est."fax", 1, 4), '-', SUBSTRING(est."fax", 5)), 'NÃO INFORMADO') AS "faxCompleto",
             COALESCE(TO_CHAR(TO_DATE(est."dataInicioAtividade", 'YYYYMMDD'), 'DD-MM-YYYY'), 'NÃO INFORMADO') AS "dataInicioAtividade",
             COALESCE(TO_CHAR(TO_DATE(est."dataSituacaoCadastral", 'YYYYMMDD'), 'DD-MM-YYYY'), 'NÃO INFORMADO') AS "dataSituacaoCadastral",
             CASE est."situacaoCadastral"
                 WHEN 1 THEN 'NULA'
                 WHEN 2 THEN 'ATIVA'
                 WHEN 3 THEN 'SUSPENSA'
                 WHEN 4 THEN 'INAPTA'
                 WHEN 8 THEN 'BAIXADA'
                 ELSE 'DESCONHECIDA'
             END AS "situacaoCadastral",
             COALESCE(sitCad."descricao", 'NÃO INFORMADO') AS "motivoSituacaoCadastralDescricao"
      FROM "empresas" e
      INNER JOIN "estabelecimentos" est ON e."cnpjBasico" = est."cnpjBasico"
      LEFT JOIN "municipios" mun ON est."municipio" = mun."codigo"
      LEFT JOIN "situacaoCadastral" sitCad ON est."motivoSituacaoCadastral" = sitCad."codigo"::int
      WHERE e."cnpjBasico" = ${cnpjBasico}
    `;
    
    if (result.length === 0) {
      return null;
    }
    return { result: result[0] };
  }
};
