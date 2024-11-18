-- CreateTable
CREATE TABLE "cnae" (
    "cnaeId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(20) NOT NULL,
    "descricao" VARCHAR(500) NOT NULL,

    CONSTRAINT "cnae_pkey" PRIMARY KEY ("cnaeId")
);

-- CreateTable
CREATE TABLE "empresas" (
    "empresaId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpj" VARCHAR(14) NOT NULL,
    "razaoSocial" VARCHAR(255) NOT NULL,
    "naturezaJuridica" VARCHAR(255) NOT NULL,
    "qualificacaoResponsavel" VARCHAR(255) NOT NULL,
    "capitalSocial" VARCHAR(30) NOT NULL,
    "porteEmpresa" INTEGER NOT NULL,
    "enteFederativoResponsavel" VARCHAR(255) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("empresaId")
);

-- CreateTable
CREATE TABLE "estabelecimentos" (
    "idestabelecimento" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjBasico" CHAR(8) NOT NULL,
    "cnpjOrdem" CHAR(4) NOT NULL,
    "cnpjDv" CHAR(2) NOT NULL,
    "identificadorMatrizFilial" INTEGER NOT NULL,
    "nomeFantasia" VARCHAR(255),
    "situacaoCadastral" INTEGER NOT NULL,
    "dataSituacaoCadastral" TIMESTAMP(3),
    "motivoSituacaoCadastral" INTEGER,
    "nomeCidadeExterior" VARCHAR(255),
    "pais" INTEGER,
    "dataInicioAtividade" TIMESTAMP(3),
    "cnaeFiscalPrincipal" INTEGER NOT NULL,
    "cnaeFiscalSecundaria" VARCHAR(255),
    "tipoLogradouro" VARCHAR(255),
    "logradouro" VARCHAR(255),
    "numero" VARCHAR(255),
    "complemento" VARCHAR(255),
    "bairro" VARCHAR(255),
    "cep" VARCHAR(20),
    "uf" VARCHAR(2),
    "municipio" INTEGER,
    "ddd1" VARCHAR(4),
    "telefone1" VARCHAR(20),
    "ddd2" VARCHAR(4),
    "telefone2" VARCHAR(20),
    "dddFax" VARCHAR(4),
    "fax" VARCHAR(20),
    "correioEletronico" VARCHAR(255),
    "situacaoEspecial" VARCHAR(255),
    "dataSituacaoEspecial" TIMESTAMP(3),

    CONSTRAINT "estabelecimentos_pkey" PRIMARY KEY ("idestabelecimento")
);

-- CreateTable
CREATE TABLE "simples" (
    "simplesId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjBasico" CHAR(8) NOT NULL,
    "opcaoPeloSimples" CHAR(1) NOT NULL,
    "dataOpcaoPeloSimples" TIMESTAMP(3),
    "dataExclusaoDoSimples" TIMESTAMP(3),
    "opcaoPeloMei" CHAR(1) NOT NULL,
    "dataOpcaoPeloMei" TIMESTAMP(3),
    "dataExclusaoDoMei" TIMESTAMP(3),

    CONSTRAINT "simples_pkey" PRIMARY KEY ("simplesId")
);

-- CreateTable
CREATE TABLE "socios" (
    "socioId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cnpjBasico" CHAR(8) NOT NULL,
    "identificadorSocio" INTEGER NOT NULL,
    "nomeSocio" VARCHAR(255),
    "cnpjCpfSocio" VARCHAR(14),
    "qualificacaoSocio" INTEGER NOT NULL,
    "dataEntradaSociedade" TIMESTAMP(3),
    "pais" INTEGER,
    "representanteLegal" VARCHAR(11),
    "nomeRepresentante" VARCHAR(255),
    "qualificacaoRepresentante" INTEGER,
    "faixaEtaria" INTEGER,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("socioId")
);

-- CreateTable
CREATE TABLE "municipio" (
    "municipioId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("municipioId")
);

-- CreateTable
CREATE TABLE "naturezas" (
    "naturezaId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "naturezas_pkey" PRIMARY KEY ("naturezaId")
);
