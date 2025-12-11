-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ALTER COLUMN "credits" SET DEFAULT 5;
