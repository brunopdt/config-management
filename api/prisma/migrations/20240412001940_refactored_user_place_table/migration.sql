/*
  Warnings:

  - You are about to drop the `_PlaceToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlaceToUser" DROP CONSTRAINT "_PlaceToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToUser" DROP CONSTRAINT "_PlaceToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "bio" DROP DEFAULT,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "instagram" DROP DEFAULT,
ALTER COLUMN "profilePicture" DROP NOT NULL,
ALTER COLUMN "profilePicture" DROP DEFAULT,
ALTER COLUMN "tiktok" DROP NOT NULL,
ALTER COLUMN "tiktok" DROP DEFAULT,
ALTER COLUMN "twitter" DROP NOT NULL,
ALTER COLUMN "twitter" DROP DEFAULT;

-- DropTable
DROP TABLE "_PlaceToUser";

-- CreateTable
CREATE TABLE "UserPlace" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "UserPlace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPlace" ADD CONSTRAINT "UserPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlace" ADD CONSTRAINT "UserPlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
