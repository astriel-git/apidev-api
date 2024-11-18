-- CreateEnum
CREATE TYPE "Status" AS ENUM ('concluida', 'pendente', 'falha', 'cancelamento');

-- CreateEnum
CREATE TYPE "MetodoPagto" AS ENUM ('credito', 'debito', 'transferencia', 'boleto', 'pix');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "userId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdate" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11),
    "cnpj" VARCHAR(14),
    "senha" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Saldo" (
    "saldoId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdate" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,
    "pacoteId" BIGINT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Saldo_pkey" PRIMARY KEY ("saldoId")
);

-- CreateTable
CREATE TABLE "Pacote" (
    "pacoteId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdate" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL,

    CONSTRAINT "Pacote_pkey" PRIMARY KEY ("pacoteId")
);

-- CreateTable
CREATE TABLE "Cobranca" (
    "cobrancaId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdate" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,
    "pacoteId" BIGINT NOT NULL,
    "dataPagto" TIMESTAMP(3),
    "metodoPagto" "MetodoPagto" NOT NULL,
    "status" "Status" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cobranca_pkey" PRIMARY KEY ("cobrancaId")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "pagamentoId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdate" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,
    "cobrancaId" BIGINT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataPagto" TIMESTAMP(3) NOT NULL,
    "metodoPagto" "MetodoPagto" NOT NULL,
    "providerTransId" TEXT NOT NULL,
    "providerResponseCode" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("pagamentoId")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "contratoId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdate" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,
    "pacoteId" BIGINT NOT NULL,
    "tipoPlano" TEXT NOT NULL,
    "saldoCiclo" DOUBLE PRECISION NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "dataCobranca" TIMESTAMP(3) NOT NULL,
    "cobrancaAuto" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("contratoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Saldo_userId_idx" ON "Saldo"("userId");

-- CreateIndex
CREATE INDEX "Saldo_pacoteId_idx" ON "Saldo"("pacoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Saldo_userId_pacoteId_key" ON "Saldo"("userId", "pacoteId");

-- CreateIndex
CREATE INDEX "Cobranca_userId_idx" ON "Cobranca"("userId");

-- CreateIndex
CREATE INDEX "Cobranca_pacoteId_idx" ON "Cobranca"("pacoteId");

-- CreateIndex
CREATE INDEX "Pagamento_userId_idx" ON "Pagamento"("userId");

-- CreateIndex
CREATE INDEX "Pagamento_cobrancaId_idx" ON "Pagamento"("cobrancaId");

-- CreateIndex
CREATE INDEX "Contrato_userId_idx" ON "Contrato"("userId");

-- CreateIndex
CREATE INDEX "Contrato_pacoteId_idx" ON "Contrato"("pacoteId");

-- AddForeignKey
ALTER TABLE "Saldo" ADD CONSTRAINT "Saldo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saldo" ADD CONSTRAINT "Saldo_pacoteId_fkey" FOREIGN KEY ("pacoteId") REFERENCES "Pacote"("pacoteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cobranca" ADD CONSTRAINT "Cobranca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cobranca" ADD CONSTRAINT "Cobranca_pacoteId_fkey" FOREIGN KEY ("pacoteId") REFERENCES "Pacote"("pacoteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_cobrancaId_fkey" FOREIGN KEY ("cobrancaId") REFERENCES "Cobranca"("cobrancaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_pacoteId_fkey" FOREIGN KEY ("pacoteId") REFERENCES "Pacote"("pacoteId") ON DELETE RESTRICT ON UPDATE CASCADE;
