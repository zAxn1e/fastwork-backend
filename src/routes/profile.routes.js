const express = require("express");
const profileController = require("@/controllers/profile.controller");
const requireSessionAuth = require("@/middlewares/requireSessionAuth");
const { uploadProfileImage } = require("@/middlewares/uploadProfileImage");

const router = express.Router();

router.get("/", requireSessionAuth, profileController.getProfile);
router.patch("/", requireSessionAuth, profileController.updateProfile);
router.post(
  "/image",
  requireSessionAuth,
  (req, res, next) => {
    uploadProfileImage(req, res, (error) => {
      if (error) {
        next(error);
        return;
      }
      next();
    });
  },
  profileController.uploadProfileImage,
);
router.delete("/image", requireSessionAuth, profileController.deleteProfileImage);

module.exports = router;
