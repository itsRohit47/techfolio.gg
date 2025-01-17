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
ADD COLUMN     "codechef" TEXT,
ADD COLUMN     "codeforces" TEXT,
ADD COLUMN     "hackerrank" TEXT,
ADD COLUMN     "hackthebox" TEXT,
ADD COLUMN     "kaggle" TEXT,
ADD COLUMN     "leetcode" TEXT,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "tryhackme" TEXT,
ADD COLUMN     "twitter" TEXT;

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
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT,
    "icon" TEXT,
    "body" TEXT,
    "links" TEXT,
    "order" INTEGER,
    "category" TEXT,
    "userId" TEXT NOT NULL,
    "customButton" TEXT,
    "customButtonLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
