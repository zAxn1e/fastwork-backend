const multer = require("multer");
const { AppError } = require("@/utils/http");
const { maxUploadFileSizeBytes } = require("@/config/env");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/tiff",
]);

const uploadMediaAsset = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadFileSizeBytes,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError(400, "Only image media files are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("file");

module.exports = {
  uploadMediaAsset,
};
