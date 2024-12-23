/*
  Warnings:

  - You are about to drop the column `skill` on the `UserSkill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,skillId]` on the table `UserSkill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `skillId` to the `UserSkill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skill_fkey";

-- DropIndex
DROP INDEX "UserSkill_userId_skill_key";

-- AlterTable
ALTER TABLE "UserSkill" DROP COLUMN "skill",
ADD COLUMN     "skillId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "UserSkill"("userId", "skillId");

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
