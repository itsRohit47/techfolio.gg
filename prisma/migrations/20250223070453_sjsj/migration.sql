-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "tags" TEXT[];
