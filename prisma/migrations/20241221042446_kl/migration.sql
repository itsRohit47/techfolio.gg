-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "body" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "links" DROP NOT NULL,
ALTER COLUMN "links" SET DATA TYPE TEXT;
