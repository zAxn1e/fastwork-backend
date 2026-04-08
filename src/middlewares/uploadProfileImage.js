const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { AppError } = require("@/utils/http");
const { mediaBaseDir, maxUploadFileSizeBytes } = require("@/config/env");

const profilesDir = path.resolve(process.cwd(), mediaBaseDir, "profiles");
fs.mkdirSync(profilesDir, { recursive: true });

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, profilesDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext || ".bin";
    cb(null, `${Date.now()}-${crypto.randomUUID()}${safeExt}`);
  },
});

const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: maxUploadFileSizeBytes,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError(400, "Only image files are allowed (jpeg, png, webp, gif)"));
      return;
    }
    cb(null, true);
  },
}).single("image");

module.exports = {
  uploadProfileImage,
  profilesDir,
};
