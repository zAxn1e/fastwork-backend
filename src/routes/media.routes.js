const express = require("express");
const requireSessionAuth = require("@/middlewares/requireSessionAuth");
const { uploadMediaAsset } = require("@/middlewares/uploadMediaAsset");
const mediaAssetController = require("@/controllers/mediaAsset.controller");

const router = express.Router();

router.get("/", requireSessionAuth, mediaAssetController.listMyMediaAssets);
router.get("/:id", requireSessionAuth, mediaAssetController.getMyMediaAssetById);
router.post(
  "/upload",
  requireSessionAuth,
  (req, res, next) => {
    uploadMediaAsset(req, res, (error) => {
      if (error) {
        next(error);
        return;
      }
      next();
    });
  },
  mediaAssetController.uploadMediaAsset,
);
router.delete("/:id", requireSessionAuth, mediaAssetController.deleteMyMediaAsset);

module.exports = router;
