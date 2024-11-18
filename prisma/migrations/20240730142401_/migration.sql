/*
  Warnings:

  - You are about to alter the column `cnpjBasico` on the `empresas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `VarChar(8)`.

*/
-- AlterTable
ALTER TABLE "empresas" ALTER COLUMN "cnpjBasico" SET DATA TYPE VARCHAR(8);

-- AlterTable
ALTER TABLE "estabelecimentos" ALTER COLUMN "cnpjBasico" DROP NOT NULL,
ALTER COLUMN "cnpjBasico" SET DATA TYPE VARCHAR(8),
ALTER COLUMN "cnpjOrdem" DROP NOT NULL,
ALTER COLUMN "cnpjOrdem" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "cnpjDv" DROP NOT NULL,
ALTER COLUMN "cnpjDv" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "identificadorMatrizFilial" DROP NOT NULL,
ALTER COLUMN "dataSituacaoCadastral" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "dataInicioAtividade" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "cnaeFiscalPrincipal" DROP NOT NULL,
ALTER COLUMN "dataSituacaoEspecial" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "municipios" ALTER COLUMN "codigo" DROP NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "naturezas" ALTER COLUMN "codigo" DROP NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "simples" ALTER COLUMN "cnpjBasico" DROP NOT NULL,
ALTER COLUMN "opcaoPeloSimples" DROP NOT NULL,
ALTER COLUMN "dataOpcaoPeloSimples" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "dataExclusaoDoSimples" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "opcaoPeloMei" DROP NOT NULL,
ALTER COLUMN "opcaoPeloMei" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "dataOpcaoPeloMei" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "dataExclusaoDoMei" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "socios" ALTER COLUMN "cnpjBasico" DROP NOT NULL,
ALTER COLUMN "identificadorSocio" DROP NOT NULL,
ALTER COLUMN "qualificacaoSocio" DROP NOT NULL,
ALTER COLUMN "dataEntradaSociedade" SET DATA TYPE VARCHAR(40);
