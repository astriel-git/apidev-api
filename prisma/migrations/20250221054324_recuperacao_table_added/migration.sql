-- CreateTable
CREATE TABLE "recuperacao" (
    "id" BIGSERIAL NOT NULL,
    "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" VARCHAR(255) NOT NULL,
    "expiracao" TIMESTAMP(3) NOT NULL,
    "userid" BIGINT NOT NULL,

    CONSTRAINT "recuperacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recuperacao" ADD CONSTRAINT "recuperacao_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
