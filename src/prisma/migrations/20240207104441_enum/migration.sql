/*
  Warnings:

  - The `specificDays` column on the `Habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `frequency` on the `Habit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL,
DROP COLUMN "specificDays",
ADD COLUMN     "specificDays" TEXT[];
