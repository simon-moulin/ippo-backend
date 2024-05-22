/*
  Warnings:

  - Made the column `habitId` on table `Validation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Validation" DROP CONSTRAINT "Validation_habitId_fkey";

-- AlterTable
ALTER TABLE "Validation" ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL,
ALTER COLUMN "habitId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
