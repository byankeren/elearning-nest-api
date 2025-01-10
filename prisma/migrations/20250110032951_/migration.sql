/*
  Warnings:

  - You are about to drop the column `views` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `views`,
    ADD COLUMN `likes` INTEGER NULL;
