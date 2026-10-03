-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_idempotencyKeyId_fkey` FOREIGN KEY (`idempotencyKeyId`) REFERENCES `IdempotencyKey`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
