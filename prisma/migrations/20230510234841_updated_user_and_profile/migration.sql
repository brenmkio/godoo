/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[handle]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `handle` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "handle" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "pronouns" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "settings" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "user_status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "Profile"("handle");
