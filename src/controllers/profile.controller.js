const path = require("path");
const asyncHandler = require("@/utils/asyncHandler");
const { AppError, sendSuccess } = require("@/utils/http");
const { requireNonEmptyString } = require("@/utils/validation");
const { sanitizeUser } = require("@/utils/sanitizeUser");
const profileService = require("@/services/profile.service");

const getProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.auth.userId);
  return sendSuccess(res, { user: sanitizeUser(user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const payload = {};

  if (req.body.displayName !== undefined) {
    payload.displayName = requireNonEmptyString(req.body.displayName, "displayName");
  }

  if (req.body.bio !== undefined) {
    payload.bio = requireNonEmptyString(req.body.bio, "bio");
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(400, "At least one updatable field is required");
  }

  const updated = await profileService.updateProfile(req.auth.userId, payload);
  return sendSuccess(res, { user: sanitizeUser(updated) });
});

const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "image file is required",
    });
  }

  const profileImageUrl = `/media/profiles/${path.basename(req.file.filename)}`;
  const updated = await profileService.updateProfileImage(req.auth.userId, profileImageUrl);

  return sendSuccess(res, {
    user: sanitizeUser(updated),
    uploadedFile: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: profileImageUrl,
    },
  });
});

const deleteProfileImage = asyncHandler(async (req, res) => {
  const updated = await profileService.removeProfileImage(req.auth.userId);
  return sendSuccess(res, {
    user: sanitizeUser(updated),
    message: "Profile image deleted",
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};
