/*
  Warnings:

  - You are about to drop the `Certification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- DropTable
DROP TABLE "Certification";

-- DropTable
DROP TABLE "Skill";

-- DropEnum
DROP TYPE "SkillLevel";

-- CreateTable
CREATE TABLE "CertificationDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificationDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCertification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "issued" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillDefinitionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CertificationDefinitionToUserCertification" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificationDefinition_name_key" ON "CertificationDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SkillDefinition_name_key" ON "SkillDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillDefinitionId_key" ON "UserSkill"("userId", "skillDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificationDefinitionToUserCertification_AB_unique" ON "_CertificationDefinitionToUserCertification"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificationDefinitionToUserCertification_B_index" ON "_CertificationDefinitionToUserCertification"("B");

-- AddForeignKey
ALTER TABLE "UserCertification" ADD CONSTRAINT "UserCertification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillDefinitionId_fkey" FOREIGN KEY ("skillDefinitionId") REFERENCES "SkillDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationDefinitionToUserCertification" ADD CONSTRAINT "_CertificationDefinitionToUserCertification_A_fkey" FOREIGN KEY ("A") REFERENCES "CertificationDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationDefinitionToUserCertification" ADD CONSTRAINT "_CertificationDefinitionToUserCertification_B_fkey" FOREIGN KEY ("B") REFERENCES "UserCertification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
