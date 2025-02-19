/*
  Warnings:

  - Added the required column `datanascimento` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `cpf` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "datanascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "razaosocial" VARCHAR(255),
ALTER COLUMN "cpf" SET NOT NULL;
