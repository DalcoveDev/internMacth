/*
  Warnings:

  - Made the column `updatedAt` on table `internship` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- Set default value for existing NULL updatedAt values
UPDATE `internship` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;
UPDATE `user` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;
UPDATE `student` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;
UPDATE `company` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;
UPDATE `application` SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL;
ALTER TABLE `internship` MODIFY `updatedAt` DATETIME(3) NOT NULL;
ALTER TABLE `user` MODIFY `updatedAt` DATETIME(3) NOT NULL;
ALTER TABLE `student` MODIFY `updatedAt` DATETIME(3) NOT NULL;
ALTER TABLE `company` MODIFY `updatedAt` DATETIME(3) NOT NULL;
ALTER TABLE `application` MODIFY `updatedAt` DATETIME(3) NOT NULL;
