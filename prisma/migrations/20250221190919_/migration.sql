/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `recuperacao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recuperacao_token_key" ON "recuperacao"("token");
