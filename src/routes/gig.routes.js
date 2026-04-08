const express = require("express");
const gigController = require("@/controllers/gig.controller");

const router = express.Router();

router.get("/", gigController.listGigs);
router.get("/:id", gigController.getGigById);
router.post("/", gigController.createGig);
router.put("/:id", gigController.updateGig);
router.delete("/:id", gigController.deleteGig);

module.exports = router;
