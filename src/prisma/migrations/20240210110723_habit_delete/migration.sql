-- AlterTable
ALTER TABLE "Follows" ADD COLUMN     "subscribe" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
