/*
  Warnings:

  - You are about to drop the `Universities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_universityId_fkey";

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "UniversityName" TEXT;

-- DropTable
DROP TABLE "Universities";
