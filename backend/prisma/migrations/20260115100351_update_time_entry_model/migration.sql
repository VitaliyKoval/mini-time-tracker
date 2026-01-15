/*
  Warnings:

  - You are about to drop the column `date` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `TimeEntry` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `TimeEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TimeEntry" ("createdAt", "description", "id") SELECT "createdAt", "description", "id" FROM "TimeEntry";
DROP TABLE "TimeEntry";
ALTER TABLE "new_TimeEntry" RENAME TO "TimeEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
