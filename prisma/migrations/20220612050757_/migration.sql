/*
  Warnings:

  - The primary key for the `books` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `books` DROP PRIMARY KEY,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `author` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateTable
CREATE TABLE `sessions` (
    `session_id` VARCHAR(128) NOT NULL,
    `expires` INTEGER UNSIGNED NOT NULL,
    `data` MEDIUMTEXT NULL,

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_books` (
    `user_id` INTEGER UNSIGNED NOT NULL,
    `book_id` INTEGER UNSIGNED NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_books_fk_2`(`book_id`),
    PRIMARY KEY (`user_id`, `book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_books` ADD CONSTRAINT `user_books_fk_2` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_books` ADD CONSTRAINT `user_books_fk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
