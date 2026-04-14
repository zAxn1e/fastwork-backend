const express = require("express");
const gigController = require("@/controllers/gig.controller");
const requireJwtAuth = require("@/middlewares/requireJwtAuth");
const { uploadMediaAsset } = require("@/middlewares/uploadMediaAsset");

const router = express.Router();

router.get("/", gigController.listGigs);
router.get("/:id", gigController.getGigById);
router.get("/:id/media", gigController.listGigMedia);
router.post("/", requireJwtAuth, gigController.createGig);
router.put("/:id", requireJwtAuth, gigController.updateGig);
router.post(
  "/:id/media/upload",
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
  gigController.uploadGigMedia,
);
router.delete("/:id/media/:mediaId", requireJwtAuth, gigController.deleteGigMedia);
router.delete("/:id", requireJwtAuth, gigController.deleteGig);

module.exports = router;
