-- DropForeignKey
ALTER TABLE `post_details` DROP FOREIGN KEY `post_details_post_id_fkey`;

-- AddForeignKey
ALTER TABLE `post_details` ADD CONSTRAINT `post_details_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
