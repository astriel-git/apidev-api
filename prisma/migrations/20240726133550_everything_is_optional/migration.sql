-- AlterTable
ALTER TABLE "empresas" ALTER COLUMN "cnpj" DROP NOT NULL,
ALTER COLUMN "razaoSocial" DROP NOT NULL,
ALTER COLUMN "naturezaJuridica" DROP NOT NULL,
ALTER COLUMN "qualificacaoResponsavel" DROP NOT NULL,
ALTER COLUMN "capitalSocial" DROP NOT NULL,
ALTER COLUMN "porteEmpresa" DROP NOT NULL;
