-- CreateEnum
CREATE TYPE "status" AS ENUM ('concluida', 'pendente', 'falha', 'cancelamento');

-- CreateEnum
CREATE TYPE "metodopagto" AS ENUM ('credito', 'debito', 'transferencia', 'boleto', 'pix');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "user" (
    "iduser" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "datanascimento" TIMESTAMP(3) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "cnpj" VARCHAR(14),
    "razaosocial" VARCHAR(255),
    "senha" VARCHAR(255) NOT NULL,
    "role" "role" NOT NULL DEFAULT 'user',
    "ultimoacessoip" VARCHAR(255),
    "ultimoacessodata" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("iduser")
);

-- CreateTable
CREATE TABLE "saldo" (
    "idsaldo" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,
    "pacoteid" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "saldo_pkey" PRIMARY KEY ("idsaldo")
);

-- CreateTable
CREATE TABLE "pacote" (
    "idpacote" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "features" TEXT[],
    "valor" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "pacote_pkey" PRIMARY KEY ("idpacote")
);

-- CreateTable
CREATE TABLE "fatura" (
    "idfatura" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,
    "pacoteid" TEXT NOT NULL,
    "datastatus" TIMESTAMP(3),
    "metodopagto" "metodopagto" NOT NULL,
    "status" "status" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "fatura_pkey" PRIMARY KEY ("idfatura")
);

-- CreateTable
CREATE TABLE "transacao" (
    "idtransacao" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,
    "faturaid" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "datapagto" TIMESTAMP(3) NOT NULL,
    "metodopagto" "metodopagto" NOT NULL,
    "providertransid" TEXT NOT NULL,
    "providerresponsecode" TEXT NOT NULL,
    "status" "status" NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "transacao_pkey" PRIMARY KEY ("idtransacao")
);

-- CreateTable
CREATE TABLE "contrato" (
    "idcontrato" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataupdate" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,
    "pacoteid" TEXT NOT NULL,
    "tipoplano" TEXT NOT NULL,
    "saldociclo" DOUBLE PRECISION NOT NULL,
    "datainicio" TIMESTAMP(3) NOT NULL,
    "datafim" TIMESTAMP(3),
    "datafatura" TIMESTAMP(3) NOT NULL,
    "faturaauto" BOOLEAN NOT NULL,
    "status" "status" NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "contrato_pkey" PRIMARY KEY ("idcontrato")
);

-- CreateTable
CREATE TABLE "recuperacao" (
    "idrecuperacao" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" VARCHAR(255) NOT NULL,
    "expiracao" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "recuperacao_pkey" PRIMARY KEY ("idrecuperacao")
);

-- CreateTable
CREATE TABLE "token" (
    "idtoken" TEXT NOT NULL,
    "tokenidpublico" VARCHAR(255) NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "ultimautilizacao" TIMESTAMP(3) NOT NULL,
    "userid" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "token_pkey" PRIMARY KEY ("idtoken")
);

-- CreateTable
CREATE TABLE "consulta" (
    "idconsulta" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" TEXT NOT NULL,
    "cnpj" TEXT,
    "cpf" TEXT,
    "ip" TEXT NOT NULL,
    "pacoteid" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "tokenid" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("idconsulta")
);

-- CreateTable
CREATE TABLE "relatorioconsultas" (
    "idrelatorioconsulta" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultaid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "pacoteid" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "relatorioconsultas_pkey" PRIMARY KEY ("idrelatorioconsulta")
);

-- CreateTable
CREATE TABLE "errorsapi" (
    "iderroapi" TEXT NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "pacoteid" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "descricaoerro" TEXT NOT NULL,
    "descricaosolucao" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedat" TIMESTAMP(3),

    CONSTRAINT "errorsapi_pkey" PRIMARY KEY ("iderroapi")
);

-- CreateTable
CREATE TABLE "cnae" (
    "idcnae" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(20) NOT NULL,
    "descricao" VARCHAR(500) NOT NULL,

    CONSTRAINT "cnae_pkey" PRIMARY KEY ("idcnae")
);

-- CreateTable
CREATE TABLE "empresas" (
    "idempresa" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjbasico" VARCHAR(8) NOT NULL,
    "razaosocial" VARCHAR(255),
    "naturezajuridica" VARCHAR(255),
    "qualificacaoresponsavel" VARCHAR(255),
    "capitalsocial" VARCHAR(30),
    "porteempresa" INTEGER,
    "entefederativoresponsavel" VARCHAR(255),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("idempresa")
);

-- CreateTable
CREATE TABLE "estabelecimentos" (
    "idestabelecimento" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjbasico" VARCHAR(8) NOT NULL,
    "cnpjordem" VARCHAR(4),
    "cnpjdv" VARCHAR(2),
    "identificadormatrizfilial" INTEGER,
    "nomefantasia" VARCHAR(255),
    "situacaocadastralid" BIGINT NOT NULL,
    "datasituacaocadastral" TIMESTAMP(3),
    "motivosituacaocadastral" INTEGER,
    "nomecidadeexterior" VARCHAR(255),
    "paisid" INTEGER,
    "datainicioatividade" TIMESTAMP(3),
    "cnaefiscalprincipalid" VARCHAR(20),
    "cnaefiscalsecundarioid" VARCHAR(20),
    "tipologradouro" VARCHAR(255),
    "logradouro" VARCHAR(255),
    "numero" VARCHAR(255),
    "complemento" VARCHAR(255),
    "bairro" VARCHAR(255),
    "cep" VARCHAR(20),
    "uf" VARCHAR(2),
    "municipioid" VARCHAR(10),
    "ddd1" VARCHAR(4),
    "telefone1" VARCHAR(20),
    "ddd2" VARCHAR(4),
    "telefone2" VARCHAR(20),
    "dddfax" VARCHAR(4),
    "fax" VARCHAR(20),
    "correioeletronico" VARCHAR(255),
    "situacaoespecial" VARCHAR(255),
    "datasituacaoespecial" TIMESTAMP(3),

    CONSTRAINT "estabelecimentos_pkey" PRIMARY KEY ("idestabelecimento")
);

-- CreateTable
CREATE TABLE "simples" (
    "idsimples" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjbasico" CHAR(8) NOT NULL,
    "opcopelosimples" CHAR(1),
    "dataopcelosimples" TIMESTAMP(3),
    "dataexclusaodosimples" TIMESTAMP(3),
    "opcopelomei" VARCHAR(3),
    "dataopcelomei" TIMESTAMP(3),
    "dataexclusaodomei" TIMESTAMP(3),

    CONSTRAINT "simples_pkey" PRIMARY KEY ("idsimples")
);

-- CreateTable
CREATE TABLE "socios" (
    "idsocio" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjbasico" CHAR(8) NOT NULL,
    "identificadorsocio" INTEGER,
    "nomesocio" VARCHAR(255),
    "cnpjcpfsocio" VARCHAR(14),
    "qualificacaosocio" INTEGER,
    "dataentradasociedade" TIMESTAMP(3),
    "paisid" INTEGER,
    "representantelegal" VARCHAR(11),
    "nomerepresentante" VARCHAR(255),
    "qualificacaorepresentante" INTEGER,
    "faixaetaria" INTEGER,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("idsocio")
);

-- CreateTable
CREATE TABLE "municipios" (
    "idmunicipio" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("idmunicipio")
);

-- CreateTable
CREATE TABLE "naturezas" (
    "idnatureza" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "naturezas_pkey" PRIMARY KEY ("idnatureza")
);

-- CreateTable
CREATE TABLE "situacaocadastral" (
    "idsituacaocadastral" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10),
    "descricao" VARCHAR(255),

    CONSTRAINT "situacaocadastral_pkey" PRIMARY KEY ("idsituacaocadastral")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");

-- CreateIndex
CREATE INDEX "saldo_userid_idx" ON "saldo"("userid");

-- CreateIndex
CREATE INDEX "saldo_pacoteid_idx" ON "saldo"("pacoteid");

-- CreateIndex
CREATE UNIQUE INDEX "saldo_userid_pacoteid_key" ON "saldo"("userid", "pacoteid");

-- CreateIndex
CREATE INDEX "fatura_userid_idx" ON "fatura"("userid");

-- CreateIndex
CREATE INDEX "fatura_pacoteid_idx" ON "fatura"("pacoteid");

-- CreateIndex
CREATE INDEX "transacao_userid_idx" ON "transacao"("userid");

-- CreateIndex
CREATE INDEX "transacao_faturaid_idx" ON "transacao"("faturaid");

-- CreateIndex
CREATE INDEX "contrato_userid_idx" ON "contrato"("userid");

-- CreateIndex
CREATE INDEX "contrato_pacoteid_idx" ON "contrato"("pacoteid");

-- CreateIndex
CREATE UNIQUE INDEX "recuperacao_token_key" ON "recuperacao"("token");

-- CreateIndex
CREATE INDEX "recuperacao_userid_idx" ON "recuperacao"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "token_tokenidpublico_key" ON "token"("tokenidpublico");

-- CreateIndex
CREATE UNIQUE INDEX "token_token_key" ON "token"("token");

-- CreateIndex
CREATE INDEX "token_userid_idx" ON "token"("userid");

-- CreateIndex
CREATE INDEX "consulta_userid_idx" ON "consulta"("userid");

-- CreateIndex
CREATE INDEX "consulta_pacoteid_idx" ON "consulta"("pacoteid");

-- CreateIndex
CREATE INDEX "consulta_tokenid_idx" ON "consulta"("tokenid");

-- CreateIndex
CREATE INDEX "relatorioconsultas_consultaid_idx" ON "relatorioconsultas"("consultaid");

-- CreateIndex
CREATE INDEX "relatorioconsultas_userid_idx" ON "relatorioconsultas"("userid");

-- CreateIndex
CREATE INDEX "relatorioconsultas_pacoteid_idx" ON "relatorioconsultas"("pacoteid");

-- CreateIndex
CREATE INDEX "errorsapi_userid_idx" ON "errorsapi"("userid");

-- CreateIndex
CREATE INDEX "errorsapi_pacoteid_idx" ON "errorsapi"("pacoteid");

-- CreateIndex
CREATE UNIQUE INDEX "cnae_codigo_key" ON "cnae"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpjbasico_key" ON "empresas"("cnpjbasico");

-- CreateIndex
CREATE INDEX "estabelecimentos_cnpjbasico_idx" ON "estabelecimentos"("cnpjbasico");

-- CreateIndex
CREATE INDEX "estabelecimentos_cnaefiscalprincipalid_idx" ON "estabelecimentos"("cnaefiscalprincipalid");

-- CreateIndex
CREATE INDEX "estabelecimentos_cnaefiscalsecundarioid_idx" ON "estabelecimentos"("cnaefiscalsecundarioid");

-- CreateIndex
CREATE INDEX "estabelecimentos_situacaocadastralid_idx" ON "estabelecimentos"("situacaocadastralid");

-- CreateIndex
CREATE INDEX "estabelecimentos_municipioid_idx" ON "estabelecimentos"("municipioid");

-- CreateIndex
CREATE UNIQUE INDEX "estabelecimentos_cnpjbasico_cnpjordem_cnpjdv_key" ON "estabelecimentos"("cnpjbasico", "cnpjordem", "cnpjdv");

-- CreateIndex
CREATE UNIQUE INDEX "simples_cnpjbasico_key" ON "simples"("cnpjbasico");

-- CreateIndex
CREATE INDEX "simples_cnpjbasico_idx" ON "simples"("cnpjbasico");

-- CreateIndex
CREATE INDEX "socios_cnpjbasico_idx" ON "socios"("cnpjbasico");

-- CreateIndex
CREATE INDEX "socios_cnpjcpfsocio_idx" ON "socios"("cnpjcpfsocio");

-- CreateIndex
CREATE UNIQUE INDEX "municipios_codigo_key" ON "municipios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "naturezas_codigo_key" ON "naturezas"("codigo");

-- AddForeignKey
ALTER TABLE "saldo" ADD CONSTRAINT "saldo_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saldo" ADD CONSTRAINT "saldo_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("idpacote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatura" ADD CONSTRAINT "fatura_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatura" ADD CONSTRAINT "fatura_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("idpacote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "transacao_faturaid_fkey" FOREIGN KEY ("faturaid") REFERENCES "fatura"("idfatura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("idpacote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recuperacao" ADD CONSTRAINT "recuperacao_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("idpacote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_tokenid_fkey" FOREIGN KEY ("tokenid") REFERENCES "token"("idtoken") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorioconsultas" ADD CONSTRAINT "relatorioconsultas_consultaid_fkey" FOREIGN KEY ("consultaid") REFERENCES "consulta"("idconsulta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorioconsultas" ADD CONSTRAINT "relatorioconsultas_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorioconsultas" ADD CONSTRAINT "relatorioconsultas_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("idpacote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "errorsapi" ADD CONSTRAINT "errorsapi_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("iduser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "errorsapi" ADD CONSTRAINT "errorsapi_pacoteid_fkey" FOREIGN KEY ("pacoteid") REFERENCES "pacote"("idpacote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_cnpjbasico_fkey" FOREIGN KEY ("cnpjbasico") REFERENCES "empresas"("cnpjbasico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_cnaefiscalprincipalid_fkey" FOREIGN KEY ("cnaefiscalprincipalid") REFERENCES "cnae"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_cnaefiscalsecundarioid_fkey" FOREIGN KEY ("cnaefiscalsecundarioid") REFERENCES "cnae"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_situacaocadastralid_fkey" FOREIGN KEY ("situacaocadastralid") REFERENCES "situacaocadastral"("idsituacaocadastral") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_municipioid_fkey" FOREIGN KEY ("municipioid") REFERENCES "municipios"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simples" ADD CONSTRAINT "simples_cnpjbasico_fkey" FOREIGN KEY ("cnpjbasico") REFERENCES "empresas"("cnpjbasico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socios" ADD CONSTRAINT "socios_cnpjbasico_fkey" FOREIGN KEY ("cnpjbasico") REFERENCES "empresas"("cnpjbasico") ON DELETE RESTRICT ON UPDATE CASCADE;
