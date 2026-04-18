-- AlterTable
ALTER TABLE "User"
ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "birthday" TIMESTAMP(3),
ADD COLUMN "telephoneNumber" TEXT,
ADD COLUMN "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
