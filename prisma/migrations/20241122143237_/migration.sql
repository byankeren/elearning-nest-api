/*
  Warnings:

  - You are about to drop the column `guest_email` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `guest_message` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `guest_name` on the `contact_us` table. All the data in the column will be lost.
  - Added the required column `email` to the `contact_us` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `contact_us` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `contact_us` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact_us` DROP COLUMN `guest_email`,
    DROP COLUMN `guest_message`,
    DROP COLUMN `guest_name`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `message` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
