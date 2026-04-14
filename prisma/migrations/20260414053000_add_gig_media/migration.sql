-- CreateTable
CREATE TABLE "GigMedia" (
    "id" SERIAL NOT NULL,
    "gigId" INTEGER NOT NULL,
    "mediaAssetId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GigMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GigMedia_gigId_mediaAssetId_key" ON "GigMedia"("gigId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "GigMedia_gigId_idx" ON "GigMedia"("gigId");

-- CreateIndex
CREATE INDEX "GigMedia_mediaAssetId_idx" ON "GigMedia"("mediaAssetId");

-- AddForeignKey
ALTER TABLE "GigMedia" ADD CONSTRAINT "GigMedia_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigMedia" ADD CONSTRAINT "GigMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
