-- AlterTable
ALTER TABLE `application` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `company` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `updatedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `DashboardAnalytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `userType` VARCHAR(191) NULL,
    `metricType` VARCHAR(191) NOT NULL,
    `metricData` VARCHAR(191) NOT NULL,
    `dateRangeStart` DATETIME(3) NULL,
    `dateRangeEnd` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DashboardAnalytics` ADD CONSTRAINT `DashboardAnalytics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
