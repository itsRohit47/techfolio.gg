/*
  Warnings:

  - You are about to drop the column `iNeedThis` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CertificationDefinition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillsOnProjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCertification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CertificationDefinitionToUserCertification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedulingLink` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_userId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_userId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_userId_fkey";

-- DropForeignKey
ALTER TABLE "SkillsOnProjects" DROP CONSTRAINT "SkillsOnProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SkillsOnProjects" DROP CONSTRAINT "SkillsOnProjects_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserCertification" DROP CONSTRAINT "UserCertification_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CertificationDefinitionToUserCertification" DROP CONSTRAINT "_CertificationDefinitionToUserCertification_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificationDefinitionToUserCertification" DROP CONSTRAINT "_CertificationDefinitionToUserCertification_B_fkey";

-- DropForeignKey
ALTER TABLE "schedulingLink" DROP CONSTRAINT "schedulingLink_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "iNeedThis",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CertificationDefinition";

-- DropTable
DROP TABLE "Education";

-- DropTable
DROP TABLE "Experience";

-- DropTable
DROP TABLE "Projects";

-- DropTable
DROP TABLE "Skills";

-- DropTable
DROP TABLE "SkillsOnProjects";

-- DropTable
DROP TABLE "UserCertification";

-- DropTable
DROP TABLE "UserSkill";

-- DropTable
DROP TABLE "_CertificationDefinitionToUserCertification";

-- DropTable
DROP TABLE "schedulingLink";

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "body" TEXT,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
