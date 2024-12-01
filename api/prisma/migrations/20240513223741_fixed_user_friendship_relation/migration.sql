/*
  Warnings:

  - You are about to drop the `_friend` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,userId2]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId2` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_friendRequestId_fkey";

-- DropForeignKey
ALTER TABLE "_friend" DROP CONSTRAINT "_friend_A_fkey";

-- DropForeignKey
ALTER TABLE "_friend" DROP CONSTRAINT "_friend_B_fkey";

-- DropIndex
DROP INDEX "Friendship_userId_key";

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "userId2" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_friend";

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_userId2_key" ON "Friendship"("userId", "userId2");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
