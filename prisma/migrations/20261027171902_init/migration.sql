-- CreateTable
CREATE TABLE `lms_semesters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `open` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_semesters_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_lecturers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(50) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_lecturers_nidn_key`(`nidn`),
    UNIQUE INDEX `lms_lecturers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(50) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `prodi` VARCHAR(191) NULL DEFAULT 'Sistem Informasi',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_students_nim_key`(`nim`),
    UNIQUE INDEX `lms_students_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `semesterId` INTEGER NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `courseName` VARCHAR(191) NOT NULL,
    `sks` INTEGER NOT NULL DEFAULT 3,
    `group` VARCHAR(30) NOT NULL DEFAULT 'Utama',
    `description` TEXT NULL,
    `schedule` VARCHAR(191) NULL,
    `room` VARCHAR(191) NULL,
    `meetings` INTEGER NOT NULL DEFAULT 16,
    `done` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_classes_semesterId_code_group_key`(`semesterId`, `code`, `group`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_class_lecturer` (
    `classId` INTEGER NOT NULL,
    `lecturerId` INTEGER NOT NULL,

    PRIMARY KEY (`classId`, `lecturerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_enrollments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `grades` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_enrollments_classId_studentId_key`(`classId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `meeting` INTEGER NOT NULL DEFAULT 1,
    `description` TEXT NULL,
    `content` JSON NULL,
    `filePath` VARCHAR(191) NULL,
    `fileName` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `lms_resources_classId_type_idx`(`classId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentId` INTEGER NOT NULL,
    `meeting` INTEGER NOT NULL,
    `status` VARCHAR(10) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_attendance_enrollmentId_meeting_key`(`enrollmentId`, `meeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lms_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resourceId` INTEGER NOT NULL,
    `enrollmentId` INTEGER NOT NULL,
    `note` TEXT NULL,
    `filePath` VARCHAR(191) NULL,
    `fileName` VARCHAR(191) NULL,
    `score` DECIMAL(5, 2) NULL,
    `feedback` TEXT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lms_submissions_resourceId_enrollmentId_key`(`resourceId`, `enrollmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lms_classes` ADD CONSTRAINT `lms_classes_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `lms_semesters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_class_lecturer` ADD CONSTRAINT `lms_class_lecturer_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `lms_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_class_lecturer` ADD CONSTRAINT `lms_class_lecturer_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `lms_lecturers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_enrollments` ADD CONSTRAINT `lms_enrollments_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `lms_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_enrollments` ADD CONSTRAINT `lms_enrollments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `lms_students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_resources` ADD CONSTRAINT `lms_resources_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `lms_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_attendance` ADD CONSTRAINT `lms_attendance_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `lms_enrollments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_submissions` ADD CONSTRAINT `lms_submissions_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `lms_resources`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lms_submissions` ADD CONSTRAINT `lms_submissions_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `lms_enrollments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
