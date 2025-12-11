-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "referenceImageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 3;
