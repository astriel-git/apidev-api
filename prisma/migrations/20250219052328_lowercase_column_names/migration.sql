/*
  Warnings:

  - The primary key for the `cnae` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cnaeId` on the `cnae` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `cnae` table. All the data in the column will be lost.
  - The primary key for the `empresas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capitalSocial` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `cnpjBasico` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `empresaId` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `enteFederativoResponsavel` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `naturezaJuridica` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `porteEmpresa` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `qualificacaoResponsavel` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `razaoSocial` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `cnaeFiscalPrincipal` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `cnaeFiscalSecundaria` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `cnpjBasico` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `cnpjDv` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `cnpjOrdem` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `correioEletronico` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicioAtividade` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dataSituacaoCadastral` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dataSituacaoEspecial` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dddFax` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `identificadorMatrizFilial` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `motivoSituacaoCadastral` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `nomeCidadeExterior` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `nomeFantasia` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `situacaoCadastral` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `situacaoEspecial` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `tipoLogradouro` on the `estabelecimentos` table. All the data in the column will be lost.
  - The primary key for the `municipios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataCriacao` on the `municipios` table. All the data in the column will be lost.
  - You are about to drop the column `municipioId` on the `municipios` table. All the data in the column will be lost.
  - The primary key for the `naturezas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataCriacao` on the `naturezas` table. All the data in the column will be lost.
  - You are about to drop the column `naturezaId` on the `naturezas` table. All the data in the column will be lost.
  - The primary key for the `simples` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cnpjBasico` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `dataExclusaoDoMei` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `dataExclusaoDoSimples` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `dataOpcaoPeloMei` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `dataOpcaoPeloSimples` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `opcaoPeloMei` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `opcaoPeloSimples` on the `simples` table. All the data in the column will be lost.
  - You are about to drop the column `simplesId` on the `simples` table. All the data in the column will be lost.
  - The primary key for the `socios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cnpjBasico` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `cnpjCpfSocio` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `dataEntradaSociedade` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `faixaEtaria` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `identificadorSocio` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `nomeRepresentante` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `nomeSocio` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `qualificacaoRepresentante` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `qualificacaoSocio` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `representanteLegal` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the column `socioId` on the `socios` table. All the data in the column will be lost.
  - You are about to drop the `Cobranca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contrato` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pacote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saldo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `situacaoCadastral` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `situacaocadastral` to the `estabelecimentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('concluida', 'pendente', 'falha', 'cancelamento');

-- CreateEnum
CREATE TYPE "metodopagto" AS ENUM ('credito', 'debito', 'transferencia', 'boleto', 'pix');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'admin');

-- DropForeignKey
ALTER TABLE "Cobranca" DROP CONSTRAINT "Cobranca_pacoteId_fkey";

-- DropForeignKey
ALTER TABLE "Cobranca" DROP CONSTRAINT "Cobranca_userId_fkey";

-- DropForeignKey
ALTER TABLE "Contrato" DROP CONSTRAINT "Contrato_pacoteId_fkey";

-- DropForeignKey
ALTER TABLE "Contrato" DROP CONSTRAINT "Contrato_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_cobrancaId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_userId_fkey";

-- DropForeignKey
ALTER TABLE "Saldo" DROP CONSTRAINT "Saldo_pacoteId_fkey";

-- DropForeignKey
ALTER TABLE "Saldo" DROP CONSTRAINT "Saldo_userId_fkey";

-- AlterTable
ALTER TABLE "cnae" DROP CONSTRAINT "cnae_pkey",
DROP COLUMN "cnaeId",
DROP COLUMN "dataCriacao",
ADD COLUMN     "cnaeid" BIGSERIAL NOT NULL,
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "cnae_pkey" PRIMARY KEY ("cnaeid");

-- AlterTable
ALTER TABLE "empresas" DROP CONSTRAINT "empresas_pkey",
DROP COLUMN "capitalSocial",
DROP COLUMN "cnpjBasico",
DROP COLUMN "dataCriacao",
DROP COLUMN "empresaId",
DROP COLUMN "enteFederativoResponsavel",
DROP COLUMN "naturezaJuridica",
DROP COLUMN "porteEmpresa",
DROP COLUMN "qualificacaoResponsavel",
DROP COLUMN "razaoSocial",
ADD COLUMN     "capitalsocial" VARCHAR(30),
ADD COLUMN     "cnpjbasico" VARCHAR(8),
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "empresaid" BIGSERIAL NOT NULL,
ADD COLUMN     "entefederativoresponsavel" VARCHAR(255),
ADD COLUMN     "naturezajuridica" VARCHAR(255),
ADD COLUMN     "porteempresa" INTEGER,
ADD COLUMN     "qualificacaoresponsavel" VARCHAR(255),
ADD COLUMN     "razaosocial" VARCHAR(255),
ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("empresaid");

-- AlterTable
ALTER TABLE "estabelecimentos" DROP COLUMN "cnaeFiscalPrincipal",
DROP COLUMN "cnaeFiscalSecundaria",
DROP COLUMN "cnpjBasico",
DROP COLUMN "cnpjDv",
DROP COLUMN "cnpjOrdem",
DROP COLUMN "correioEletronico",
DROP COLUMN "dataCriacao",
DROP COLUMN "dataInicioAtividade",
DROP COLUMN "dataSituacaoCadastral",
DROP COLUMN "dataSituacaoEspecial",
DROP COLUMN "dddFax",
DROP COLUMN "identificadorMatrizFilial",
DROP COLUMN "motivoSituacaoCadastral",
DROP COLUMN "nomeCidadeExterior",
DROP COLUMN "nomeFantasia",
DROP COLUMN "situacaoCadastral",
DROP COLUMN "situacaoEspecial",
DROP COLUMN "tipoLogradouro",
ADD COLUMN     "cnaefiscalprincipal" VARCHAR(255),
ADD COLUMN     "cnaefiscalsecundaria" VARCHAR(255),
ADD COLUMN     "cnpjbasico" VARCHAR(8),
ADD COLUMN     "cnpjdv" VARCHAR(2),
ADD COLUMN     "cnpjordem" VARCHAR(4),
ADD COLUMN     "correioeletronico" VARCHAR(255),
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "datainicioatividade" VARCHAR(40),
ADD COLUMN     "datasituacaocadastral" VARCHAR(40),
ADD COLUMN     "datasituacaoespecial" VARCHAR(40),
ADD COLUMN     "dddfax" VARCHAR(4),
ADD COLUMN     "identificadormatrizfilial" INTEGER,
ADD COLUMN     "motivosituacaocadastral" INTEGER,
ADD COLUMN     "nomecidadeexterior" VARCHAR(255),
ADD COLUMN     "nomefantasia" VARCHAR(255),
ADD COLUMN     "situacaocadastral" INTEGER NOT NULL,
ADD COLUMN     "situacaoespecial" VARCHAR(255),
ADD COLUMN     "tipologradouro" VARCHAR(255);

-- AlterTable
ALTER TABLE "municipios" DROP CONSTRAINT "municipios_pkey",
DROP COLUMN "dataCriacao",
DROP COLUMN "municipioId",
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "municipioid" BIGSERIAL NOT NULL,
ADD CONSTRAINT "municipios_pkey" PRIMARY KEY ("municipioid");

-- AlterTable
ALTER TABLE "naturezas" DROP CONSTRAINT "naturezas_pkey",
DROP COLUMN "dataCriacao",
DROP COLUMN "naturezaId",
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "naturezaid" BIGSERIAL NOT NULL,
ADD CONSTRAINT "naturezas_pkey" PRIMARY KEY ("naturezaid");

-- AlterTable
ALTER TABLE "simples" DROP CONSTRAINT "simples_pkey",
DROP COLUMN "cnpjBasico",
DROP COLUMN "dataCriacao",
DROP COLUMN "dataExclusaoDoMei",
DROP COLUMN "dataExclusaoDoSimples",
DROP COLUMN "dataOpcaoPeloMei",
DROP COLUMN "dataOpcaoPeloSimples",
DROP COLUMN "opcaoPeloMei",
DROP COLUMN "opcaoPeloSimples",
DROP COLUMN "simplesId",
ADD COLUMN     "cnpjbasico" CHAR(8),
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataexclusaodomei" VARCHAR(40),
ADD COLUMN     "dataexclusaodosimples" VARCHAR(40),
ADD COLUMN     "dataopcelomei" VARCHAR(40),
ADD COLUMN     "dataopcelosimples" VARCHAR(40),
ADD COLUMN     "opcopelomei" VARCHAR(3),
ADD COLUMN     "opcopelosimples" CHAR(1),
ADD COLUMN     "simplesid" BIGSERIAL NOT NULL,
ADD CONSTRAINT "simples_pkey" PRIMARY KEY ("simplesid");

-- AlterTable
ALTER TABLE "socios" DROP CONSTRAINT "socios_pkey",
DROP COLUMN "cnpjBasico",
DROP COLUMN "cnpjCpfSocio",
DROP COLUMN "dataCriacao",
DROP COLUMN "dataEntradaSociedade",
DROP COLUMN "faixaEtaria",
DROP COLUMN "identificadorSocio",
DROP COLUMN "nomeRepresentante",
DROP COLUMN "nomeSocio",
DROP COLUMN "qualificacaoRepresentante",
DROP COLUMN "qualificacaoSocio",
DROP COLUMN "representanteLegal",
DROP COLUMN "socioId",
ADD COLUMN     "cnpjbasico" CHAR(8),
ADD COLUMN     "cnpjcpfsocio" VARCHAR(14),
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataentradasociedade" VARCHAR(40),
ADD COLUMN     "faixaetaria" INTEGER,
ADD COLUMN     "identificadorsocio" INTEGER,
ADD COLUMN     "nomerepresentante" VARCHAR(255),
ADD COLUMN     "nomesocio" VARCHAR(255),
ADD COLUMN     "qualificacaorepresentante" INTEGER,
ADD COLUMN     "qualificacaosocio" INTEGER,
ADD COLUMN     "representantelegal" VARCHAR(11),
ADD COLUMN     "socioid" BIGSERIAL NOT NULL,
ADD CONSTRAINT "socios_pkey" PRIMARY KEY ("socioid");

-- DropTable
DROP TABLE "Cobranca";

-- DropTable
DROP TABLE "Contrato";

-- DropTable
DROP TABLE "Pacote";

-- DropTable
DROP TABLE "Pagamento";

-- DropTable
DROP TABLE "Saldo";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "situacaoCadastral";

-- DropEnum
DROP TYPE "MetodoPagto";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "user" (
    "userid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11),
    "cnpj" VARCHAR(14),
    "senha" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "saldo" (
    "saldoid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" BIGINT NOT NULL,
    "pacoteid" BIGINT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "saldo_pkey" PRIMARY KEY ("saldoid")
);

-- CreateTable
CREATE TABLE "pacote" (
    "pacoteid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL,

    CONSTRAINT "pacote_pkey" PRIMARY KEY ("pacoteid")
);

-- CreateTable
CREATE TABLE "cobranca" (
    "cobrancaid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" BIGINT NOT NULL,
    "pacoteid" BIGINT NOT NULL,
    "datapagto" TIMESTAMP(3),
    "metodopagto" "metodopagto" NOT NULL,
    "status" "status" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cobranca_pkey" PRIMARY KEY ("cobrancaid")
);

-- CreateTable
CREATE TABLE "pagamento" (
    "pagamentoid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" BIGINT NOT NULL,
    "cobrancaid" BIGINT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "datapagto" TIMESTAMP(3) NOT NULL,
    "metodopagto" "metodopagto" NOT NULL,
    "providertransid" TEXT NOT NULL,
    "providerresponsecode" TEXT NOT NULL,
    "status" "status" NOT NULL,

    CONSTRAINT "pagamento_pkey" PRIMARY KEY ("pagamentoid")
);

-- CreateTable
CREATE TABLE "contrato" (
    "contratoid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" BIGINT NOT NULL,
    "pacoteid" BIGINT NOT NULL,
    "tipoplano" TEXT NOT NULL,
    "saldociclo" DOUBLE PRECISION NOT NULL,
    "datainicio" TIMESTAMP(3) NOT NULL,
    "datafim" TIMESTAMP(3),
    "datacobranca" TIMESTAMP(3) NOT NULL,
    "cobrancaauto" BOOLEAN NOT NULL,
    "status" "status" NOT NULL,

    CONSTRAINT "contrato_pkey" PRIMARY KEY ("contratoid")
);

-- CreateTable
CREATE TABLE "situacaocadastral" (
    "situacaoid" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10),
    "descricao" VARCHAR(255),

    CONSTRAINT "situacaocadastral_pkey" PRIMARY KEY ("situacaoid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "saldo_userid_idx" ON "saldo"("userid");

-- CreateIndex
CREATE INDEX "saldo_pacoteid_idx" ON "saldo"("pacoteid");

-- CreateIndex
CREATE UNIQUE INDEX "saldo_userid_pacoteid_key" ON "saldo"("userid", "pacoteid");

-- CreateIndex
CREATE INDEX "cobranca_userid_idx" ON "cobranca"("userid");

-- CreateIndex
CREATE INDEX "cobranca_pacoteid_idx" ON "cobranca"("pacoteid");

-- CreateIndex
CREATE INDEX "pagamento_userid_idx" ON "pagamento"("userid");

-- CreateIndex
CREATE INDEX "pagamento_cobrancaid_idx" ON "pagamento"("cobrancaid");

-- CreateIndex
CREATE INDEX "contrato_userid_idx" ON "contrato"("userid");

-- CreateIndex
CREATE INDEX "contrato_pacoteid_idx" ON "contrato"("pacoteid");

-- AddForeignKey
ALTER TABLE "saldo" ADD CONSTRAINT "saldo_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saldo" ADD CONSTRAINT "saldo_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("pacoteid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobranca" ADD CONSTRAINT "cobranca_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobranca" ADD CONSTRAINT "cobranca_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("pacoteid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_cobrancaid_fkey" FOREIGN KEY ("cobrancaid") REFERENCES "cobranca"("cobrancaid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("pacoteid") ON DELETE RESTRICT ON UPDATE CASCADE;
