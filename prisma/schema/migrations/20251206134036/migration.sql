-- CreateEnum
CREATE TYPE "GenerationType" AS ENUM ('FRAME', 'ASSET');

-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "type" "GenerationType" NOT NULL DEFAULT 'FRAME';
