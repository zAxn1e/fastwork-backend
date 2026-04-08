const reviewService = require("@/services/review.service");
const asyncHandler = require("@/utils/asyncHandler");
const { sendSuccess } = require("@/utils/http");
const {
  parseId,
  requireNonEmptyString,
  requirePositiveInt,
  requireRating,
} = require("@/utils/validation");

const listReviews = asyncHandler(async (_req, res) => {
  const reviews = await reviewService.listReviews();
  return sendSuccess(res, reviews);
});

const getReviewById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const review = await reviewService.getReviewById(id);
  return sendSuccess(res, review);
});

const createReview = asyncHandler(async (req, res) => {
  const payload = {
    orderId: requirePositiveInt(req.body.orderId, "orderId"),
    authorId: requirePositiveInt(req.body.authorId, "authorId"),
    targetUserId: requirePositiveInt(req.body.targetUserId, "targetUserId"),
    rating: requireRating(req.body.rating),
    comment:
      req.body.comment !== undefined
        ? requireNonEmptyString(req.body.comment, "comment")
        : undefined,
  };

  const review = await reviewService.createReview(payload);
  return sendSuccess(res, review, 201);
});

module.exports = {
  listReviews,
  getReviewById,
  createReview,
};
