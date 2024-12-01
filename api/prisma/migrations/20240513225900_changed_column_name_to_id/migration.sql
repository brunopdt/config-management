/*
  Warnings:

  - The primary key for the `Friendship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `friendRequestId` on the `Friendship` table. All the data in the column will be lost.
  - Added the required column `id` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_pkey",
DROP COLUMN "friendRequestId",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id");
