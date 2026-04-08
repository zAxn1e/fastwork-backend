const express = require("express");
const reviewController = require("@/controllers/review.controller");

const router = express.Router();

router.get("/", reviewController.listReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", reviewController.createReview);

module.exports = router;
