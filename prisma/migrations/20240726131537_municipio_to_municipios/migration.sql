/*
  Warnings:

  - You are about to drop the `municipio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "municipio";

-- CreateTable
CREATE TABLE "municipios" (
    "municipioId" BIGSERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("municipioId")
);
