const gigService = require("@/services/gig.service");
const asyncHandler = require("@/utils/asyncHandler");
const { AppError, sendSuccess } = require("@/utils/http");
const {
  parseBooleanQuery,
  parseId,
  parseOptionalId,
  requireNonEmptyString,
  requirePositiveInt,
  optionalPositiveInt,
} = require("@/utils/validation");

const listGigs = asyncHandler(async (req, res) => {
  const filters = {
    q: typeof req.query.q === "string" ? req.query.q.trim() : undefined,
    categoryId: parseOptionalId(req.query.categoryId, "categoryId"),
    isActive: parseBooleanQuery(req.query.isActive, "isActive"),
  };

  const gigs = await gigService.listGigs(filters);
  return sendSuccess(res, gigs);
});

const getGigById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const gig = await gigService.getGigById(id);
  return sendSuccess(res, gig);
});

const createGig = asyncHandler(async (req, res) => {
  const payload = {
    title: requireNonEmptyString(req.body.title, "title"),
    description: requireNonEmptyString(req.body.description, "description"),
    price: requirePositiveInt(req.body.price, "price"),
    ownerId: requirePositiveInt(req.body.ownerId, "ownerId"),
    categoryId: requirePositiveInt(req.body.categoryId, "categoryId"),
  };

  if (req.body.isActive !== undefined) {
    if (typeof req.body.isActive !== "boolean") {
      throw new AppError(400, "isActive must be a boolean");
    }
    payload.isActive = req.body.isActive;
  }

  const gig = await gigService.createGig(payload);
  return sendSuccess(res, gig, 201);
});

const updateGig = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const payload = {};

  if (req.body.title !== undefined) {
    payload.title = requireNonEmptyString(req.body.title, "title");
  }

  if (req.body.description !== undefined) {
    payload.description = requireNonEmptyString(req.body.description, "description");
  }

  if (req.body.price !== undefined) {
    payload.price = optionalPositiveInt(req.body.price, "price");
  }

  if (req.body.ownerId !== undefined) {
    payload.ownerId = optionalPositiveInt(req.body.ownerId, "ownerId");
  }

  if (req.body.categoryId !== undefined) {
    payload.categoryId = optionalPositiveInt(req.body.categoryId, "categoryId");
  }

  if (req.body.isActive !== undefined) {
    if (typeof req.body.isActive !== "boolean") {
      throw new AppError(400, "isActive must be a boolean");
    }
    payload.isActive = req.body.isActive;
  }

  const updated = await gigService.updateGig(id, payload);
  return sendSuccess(res, updated);
});

const deleteGig = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await gigService.deleteGig(id);

  return res.status(200).json({
    success: true,
    data: {
      message: "Gig deleted successfully",
    },
  });
});

module.exports = {
  listGigs,
  getGigById,
  createGig,
  updateGig,
  deleteGig,
};
