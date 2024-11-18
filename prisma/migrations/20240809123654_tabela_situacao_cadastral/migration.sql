-- CreateTable
CREATE TABLE "situacaoCadastral" (
    "situacaoId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10),
    "descricao" VARCHAR(255),

    CONSTRAINT "situacaoCadastral_pkey" PRIMARY KEY ("situacaoId")
);
