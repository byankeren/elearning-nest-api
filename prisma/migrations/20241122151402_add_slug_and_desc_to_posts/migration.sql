/*
  Warnings:

  - You are about to drop the column `body` on the `posts` table. All the data in the column will be lost.
  - Added the required column `desc` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `body`,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    MODIFY `img` VARCHAR(191) NULL,
    MODIFY `read_time` INTEGER NULL,
    MODIFY `views` INTEGER NULL;
