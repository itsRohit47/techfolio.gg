/*
  Warnings:

  - You are about to drop the column `skillDefinitionId` on the `UserSkill` table. All the data in the column will be lost.
  - You are about to drop the `SkillDefinition` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,skill]` on the table `UserSkill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `skill` to the `UserSkill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skillDefinitionId_fkey";

-- DropIndex
DROP INDEX "UserSkill_userId_skillDefinitionId_key";

-- AlterTable
ALTER TABLE "UserSkill" DROP COLUMN "skillDefinitionId",
ADD COLUMN     "skill" TEXT NOT NULL;

-- DropTable
DROP TABLE "SkillDefinition";

-- CreateTable
CREATE TABLE "Skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skills_name_key" ON "Skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skill_key" ON "UserSkill"("userId", "skill");

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skill_fkey" FOREIGN KEY ("skill") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
