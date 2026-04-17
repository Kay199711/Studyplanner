-- CreateTable
CREATE TABLE "Resource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "className" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "instructor" TEXT NOT NULL DEFAULT '',
    "schedule" TEXT NOT NULL DEFAULT '',
    "semester" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "isBreak" BOOLEAN NOT NULL DEFAULT false,
    "mode" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StudySettings" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
    "dailyGoal" INTEGER NOT NULL DEFAULT 5
);
