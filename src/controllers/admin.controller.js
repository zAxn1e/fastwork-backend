const asyncHandler = require("@/utils/asyncHandler");
const { AppError, sendSuccess } = require("@/utils/http");
const {
  parseBooleanQuery,
  parseId,
  parseOptionalId,
  requireEnum,
  requireNonEmptyString,
  requirePositiveInt,
  optionalPositiveInt,
} = require("@/utils/validation");
const { sanitizeUser } = require("@/utils/sanitizeUser");
const adminService = require("@/services/admin.service");

const ALLOWED_ROLES = ["CLIENT", "FREELANCER", "ADMIN"];
const ORDER_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function sanitizeUsers(items) {
  return items.map((item) => sanitizeUser(item));
}

const getSummary = asyncHandler(async (_req, res) => {
  const summary = await adminService.getAdminSummary();
  return sendSuccess(res, summary);
});

const listUsers = asyncHandler(async (req, res) => {
  const filters = {
    q: typeof req.query.q === "string" ? req.query.q.trim() : undefined,
    role:
      req.query.role !== undefined
        ? requireEnum(req.query.role, "role", ALLOWED_ROLES)
        : undefined,
  };

  const users = await adminService.listUsers(filters);
  return sendSuccess(res, sanitizeUsers(users));
});

const getUserById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const user = await adminService.getUserById(id);
  return sendSuccess(res, sanitizeUser(user));
});

const updateUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const payload = {};

  if (req.body.displayName !== undefined) {
    payload.displayName = requireNonEmptyString(req.body.displayName, "displayName");
  }

  if (req.body.bio !== undefined) {
    payload.bio = requireNonEmptyString(req.body.bio, "bio");
  }

  if (req.body.role !== undefined) {
    payload.role = requireEnum(req.body.role, "role", ALLOWED_ROLES);
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(400, "At least one updatable field is required");
  }

  const updated = await adminService.updateUser(id, payload, req.auth.userId);
  return sendSuccess(res, sanitizeUser(updated));
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await adminService.deleteUser(id, req.auth.userId);
  return sendSuccess(res, { message: "User deleted" });
});

const listCategories = asyncHandler(async (_req, res) => {
  const categories = await adminService.listCategories();
  return sendSuccess(res, categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const name = requireNonEmptyString(req.body.name, "name");
  const category = await adminService.createCategory(name);
  return sendSuccess(res, category, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const name = requireNonEmptyString(req.body.name, "name");
  const updated = await adminService.updateCategory(id, name);
  return sendSuccess(res, updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await adminService.deleteCategory(id);
  return sendSuccess(res, { message: "Category deleted" });
});

const listGigs = asyncHandler(async (req, res) => {
  const filters = {
    q: typeof req.query.q === "string" ? req.query.q.trim() : undefined,
    categoryId: parseOptionalId(req.query.categoryId, "categoryId"),
    isActive: parseBooleanQuery(req.query.isActive, "isActive"),
  };
  const gigs = await adminService.listGigs(filters);
  return sendSuccess(res, gigs);
});

const getGigById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const gig = await adminService.getGigById(id);
  return sendSuccess(res, gig);
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
  if (req.body.categoryId !== undefined) {
    payload.categoryId = optionalPositiveInt(req.body.categoryId, "categoryId");
  }
  if (req.body.ownerId !== undefined) {
    payload.ownerId = requirePositiveInt(req.body.ownerId, "ownerId");
  }
  if (req.body.isActive !== undefined) {
    if (typeof req.body.isActive !== "boolean") {
      throw new AppError(400, "isActive must be a boolean");
    }
    payload.isActive = req.body.isActive;
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(400, "At least one updatable field is required");
  }

  const updated = await adminService.updateGig(id, payload);
  return sendSuccess(res, updated);
});

const deleteGig = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await adminService.deleteGig(id);
  return sendSuccess(res, { message: "Gig deleted" });
});

const listOrders = asyncHandler(async (req, res) => {
  const filters = {
    clientId: parseOptionalId(req.query.clientId, "clientId"),
    sellerId: parseOptionalId(req.query.sellerId, "sellerId"),
    status:
      req.query.status !== undefined
        ? requireEnum(req.query.status, "status", ORDER_STATUSES)
        : undefined,
  };

  const orders = await adminService.listOrders(filters);
  return sendSuccess(res, orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const order = await adminService.getOrderById(id);
  return sendSuccess(res, order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const status = requireEnum(req.body.status, "status", ORDER_STATUSES);
  const updated = await adminService.updateOrderStatus(id, status);
  return sendSuccess(res, updated);
});

const listReviews = asyncHandler(async (_req, res) => {
  const reviews = await adminService.listReviews();
  return sendSuccess(res, reviews);
});

const getReviewById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const review = await adminService.getReviewById(id);
  return sendSuccess(res, review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await adminService.deleteReview(id);
  return sendSuccess(res, { message: "Review deleted" });
});

module.exports = {
  getSummary,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listGigs,
  getGigById,
  updateGig,
  deleteGig,
  listOrders,
  getOrderById,
  updateOrderStatus,
  listReviews,
  getReviewById,
  deleteReview,
};
