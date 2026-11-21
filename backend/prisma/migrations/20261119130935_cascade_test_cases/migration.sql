/*
  Warnings:

  - You are about to drop the column `rating` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "rating",
ALTER COLUMN "username" DROP NOT NULL;

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "user_profile" (
    "userId" TEXT NOT NULL,
    "bio" VARCHAR(280),
    "elo" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
