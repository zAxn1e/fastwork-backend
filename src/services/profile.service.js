const fs = require("fs");
const path = require("path");
const prisma = require("@/lib/prisma");
const { AppError } = require("@/utils/http");
const { mediaBaseDir } = require("@/config/env");

function resolveProfilePathFromUrl(url) {
  if (!url) {
    return null;
  }

  const prefix = "/media/";
  if (!url.startsWith(prefix)) {
    return null;
  }

  const relative = url.slice(prefix.length);
  return path.resolve(process.cwd(), mediaBaseDir, relative);
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

async function updateProfile(userId, payload) {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
  });
}

async function updateProfileImage(userId, imageUrl) {
  const existing = await getProfile(userId);
  const oldImagePath = resolveProfilePathFromUrl(existing.profileImageUrl);

  if (oldImagePath && fs.existsSync(oldImagePath)) {
    fs.unlinkSync(oldImagePath);
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      profileImageUrl: imageUrl,
    },
  });
}

async function removeProfileImage(userId) {
  const user = await getProfile(userId);
  const imagePath = resolveProfilePathFromUrl(user.profileImageUrl);

  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      profileImageUrl: null,
    },
  });
}

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
};
