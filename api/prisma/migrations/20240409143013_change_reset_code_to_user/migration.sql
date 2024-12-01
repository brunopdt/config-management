/*
  Warnings:

  - You are about to drop the `PasswordRecovery` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "code" TEXT;

-- DropTable
DROP TABLE "PasswordRecovery";
