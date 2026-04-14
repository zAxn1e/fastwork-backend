const express = require("express");
const profileController = require("@/controllers/profile.controller");
const requireJwtAuth = require("@/middlewares/requireJwtAuth");
const { uploadProfileImage } = require("@/middlewares/uploadProfileImage");

const router = express.Router();

router.get("/", requireJwtAuth, profileController.getProfile);
router.patch("/", requireJwtAuth, profileController.updateProfile);
router.post(
  "/image",
  requireJwtAuth,
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
router.delete("/image", requireJwtAuth, profileController.deleteProfileImage);

module.exports = router;
