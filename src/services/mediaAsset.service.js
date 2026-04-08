const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const prisma = require("@/lib/prisma");
const { AppError } = require("@/utils/http");
const { mediaBaseDir, thumbnailWidth, webpQuality } = require("@/config/env");

const mediaRootDir = path.resolve(process.cwd(), mediaBaseDir);
const uploadsDir = path.join(mediaRootDir, "uploads");
const thumbnailsDir = path.join(mediaRootDir, "thumbnails");

fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(thumbnailsDir, { recursive: true });

function filePathFromUrl(url) {
  if (!url || !url.startsWith("/media/")) {
    return null;
  }
  const relative = url.slice("/media/".length);
  return path.resolve(mediaRootDir, relative);
}

async function saveProcessedFiles(file) {
  if (!file || !file.buffer) {
    throw new AppError(400, "file is required");
  }

  const id = `${Date.now()}-${crypto.randomUUID()}`;
  const uploadFilename = `${id}.webp`;
  const thumbFilename = `${id}-thumb.webp`;

  const webpBuffer = await sharp(file.buffer)
    .rotate()
    .webp({
      quality: webpQuality,
      effort: 0,
    })
    .toBuffer();

  const metadata = await sharp(webpBuffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new AppError(400, "Could not read media dimensions");
  }

  const thumbnailBuffer = await sharp(webpBuffer)
    .resize({
      width: thumbnailWidth,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: webpQuality,
      effort: 0,
    })
    .toBuffer();

  const webpFilePath = path.join(uploadsDir, uploadFilename);
  const thumbFilePath = path.join(thumbnailsDir, thumbFilename);

  fs.writeFileSync(webpFilePath, webpBuffer);
  fs.writeFileSync(thumbFilePath, thumbnailBuffer);

  return {
    originalName: file.originalname,
    sourceMimeType: file.mimetype,
    width: metadata.width,
    height: metadata.height,
    sourceSizeBytes: file.size,
    webpSizeBytes: webpBuffer.length,
    thumbnailSizeBytes: thumbnailBuffer.length,
    webpUrl: `/media/uploads/${uploadFilename}`,
    thumbnailUrl: `/media/thumbnails/${thumbFilename}`,
  };
}

async function cleanupOrphanMediaFiles() {
  const records = await prisma.mediaAsset.findMany({
    select: {
      webpUrl: true,
      thumbnailUrl: true,
    },
  });

  const keepPaths = new Set();
  for (const record of records) {
    const webpPath = filePathFromUrl(record.webpUrl);
    const thumbPath = filePathFromUrl(record.thumbnailUrl);

    if (webpPath) {
      keepPaths.add(webpPath);
    }
    if (thumbPath) {
      keepPaths.add(thumbPath);
    }
  }

  const folders = [uploadsDir, thumbnailsDir];
  for (const folder of folders) {
    if (!fs.existsSync(folder)) {
      continue;
    }

    const files = fs.readdirSync(folder);
    for (const file of files) {
      if (file === ".gitkeep") {
        continue;
      }
      const absolutePath = path.join(folder, file);
      if (!keepPaths.has(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }
  }
}

async function createMediaAsset(ownerId, file) {
  const processed = await saveProcessedFiles(file);

  const created = await prisma.mediaAsset.create({
    data: {
      ownerId,
      ...processed,
    },
  });

  await cleanupOrphanMediaFiles();

  return created;
}

async function listMyMediaAssets(ownerId) {
  return prisma.mediaAsset.findMany({
    where: { ownerId },
    orderBy: { id: "desc" },
  });
}

async function getMyMediaAssetById(ownerId, id) {
  const item = await prisma.mediaAsset.findFirst({
    where: { id, ownerId },
  });

  if (!item) {
    throw new AppError(404, "Media asset not found");
  }

  return item;
}

async function deleteMyMediaAsset(ownerId, id) {
  const item = await getMyMediaAssetById(ownerId, id);

  const webpPath = filePathFromUrl(item.webpUrl);
  const thumbPath = filePathFromUrl(item.thumbnailUrl);

  if (webpPath && fs.existsSync(webpPath)) {
    fs.unlinkSync(webpPath);
  }
  if (thumbPath && fs.existsSync(thumbPath)) {
    fs.unlinkSync(thumbPath);
  }

  await prisma.mediaAsset.delete({ where: { id } });

  await cleanupOrphanMediaFiles();
}

module.exports = {
  createMediaAsset,
  listMyMediaAssets,
  getMyMediaAssetById,
  deleteMyMediaAsset,
  cleanupOrphanMediaFiles,
};
