/*
  Warnings:

  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
DROP COLUMN "gender",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropEnum
DROP TYPE "GenderOptions";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
