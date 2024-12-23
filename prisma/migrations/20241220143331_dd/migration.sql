/*
  Warnings:

  - You are about to drop the column `UniversityName` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `universityId` on the `Education` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "UniversityName",
DROP COLUMN "universityId",
ADD COLUMN     "universityName" TEXT;
