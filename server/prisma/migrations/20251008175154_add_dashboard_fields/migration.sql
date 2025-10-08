/*
  Warnings:

  - Added the required column `updatedAt` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `application` ADD COLUMN `resumeUrl` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `viewed` BOOLEAN NOT NULL DEFAULT false;

-- Set default value for existing NULL updatedAt values
UPDATE `application` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;

-- AlterTable
ALTER TABLE `company` ADD COLUMN `industry` VARCHAR(191) NULL,
    ADD COLUMN `logoUrl` VARCHAR(191) NULL,
    ADD COLUMN `size` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- Set default value for existing NULL updatedAt values
UPDATE `company` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;

-- AlterTable
ALTER TABLE `internship` ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- Set default value for existing NULL updatedAt values
UPDATE `internship` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `github` VARCHAR(191) NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;

-- Set default value for existing NULL updatedAt values
UPDATE `student` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `lastLogin` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- Set default value for existing NULL updatedAt values
UPDATE `user` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;
