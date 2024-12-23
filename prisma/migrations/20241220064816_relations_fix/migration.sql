/*
  Warnings:

  - You are about to drop the column `degree` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_UserProjects" DROP CONSTRAINT "_UserProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserProjects" DROP CONSTRAINT "_UserProjects_B_fkey";

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "degree",
DROP COLUMN "field",
ADD COLUMN     "courseName" TEXT,
ADD COLUMN     "fieldOfStudy" TEXT;

-- AlterTable
ALTER TABLE "Universities" ADD COLUMN     "logo" TEXT,
ALTER COLUMN "location" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "projectsId" TEXT;

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "Tags";

-- DropTable
DROP TABLE "_UserProjects";

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "links" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsOnProjects" (
    "skillId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillsOnProjects_pkey" PRIMARY KEY ("skillId","projectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_userId_key" ON "Projects"("userId");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnProjects" ADD CONSTRAINT "SkillsOnProjects_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnProjects" ADD CONSTRAINT "SkillsOnProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
