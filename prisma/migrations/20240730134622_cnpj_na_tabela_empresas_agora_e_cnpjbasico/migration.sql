/*
  Warnings:

  - You are about to drop the column `cnpj` on the `empresas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "empresas" DROP COLUMN "cnpj",
ADD COLUMN     "cnpjBasico" VARCHAR(14);
