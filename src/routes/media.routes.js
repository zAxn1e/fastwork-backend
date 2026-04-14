const express = require("express");
const requireJwtAuth = require("@/middlewares/requireJwtAuth");
const { uploadMediaAsset } = require("@/middlewares/uploadMediaAsset");
const mediaAssetController = require("@/controllers/mediaAsset.controller");

const router = express.Router();

router.get("/", requireJwtAuth, mediaAssetController.listMyMediaAssets);
router.get("/:id", requireJwtAuth, mediaAssetController.getMyMediaAssetById);
router.post(
  "/upload",
  requireJwtAuth,
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
router.delete("/:id", requireJwtAuth, mediaAssetController.deleteMyMediaAsset);

module.exports = router;
