-- CreateTable
CREATE TABLE "StylePreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "style" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StylePreset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StylePreset" ADD CONSTRAINT "StylePreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
