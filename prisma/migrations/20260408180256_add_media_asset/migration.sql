-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "sourceMimeType" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'webp',
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "sourceSizeBytes" INTEGER NOT NULL,
    "webpSizeBytes" INTEGER NOT NULL,
    "thumbnailSizeBytes" INTEGER NOT NULL,
    "webpUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAsset_ownerId_idx" ON "MediaAsset"("ownerId");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
