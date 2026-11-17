/*
  Warnings:

  - You are about to drop the column `description` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `expectedOutput` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `input` on the `TestCase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descriptionPath` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputPath` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputPath` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "description",
ADD COLUMN     "descriptionPath" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "expectedOutput",
DROP COLUMN "input",
ADD COLUMN     "inputPath" TEXT NOT NULL,
ADD COLUMN     "outputPath" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");
