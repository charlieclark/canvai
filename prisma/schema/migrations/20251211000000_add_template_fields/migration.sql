-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_templateSlug_key" ON "Project"("templateSlug");
