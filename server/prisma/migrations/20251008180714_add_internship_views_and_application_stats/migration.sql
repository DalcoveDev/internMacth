-- CreateTable
CREATE TABLE `InternshipView` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `internshipId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `sessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationStatistic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `internshipId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `responseTime` INTEGER NULL,
    `completionTime` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InternshipView` ADD CONSTRAINT `InternshipView_internshipId_fkey` FOREIGN KEY (`internshipId`) REFERENCES `Internship`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternshipView` ADD CONSTRAINT `InternshipView_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationStatistic` ADD CONSTRAINT `ApplicationStatistic_internshipId_fkey` FOREIGN KEY (`internshipId`) REFERENCES `Internship`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
