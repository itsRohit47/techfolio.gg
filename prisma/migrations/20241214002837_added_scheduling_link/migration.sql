-- CreateTable
CREATE TABLE "schedulingLink" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "schedulingLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedulingLink_userId_key" ON "schedulingLink"("userId");

-- AddForeignKey
ALTER TABLE "schedulingLink" ADD CONSTRAINT "schedulingLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
