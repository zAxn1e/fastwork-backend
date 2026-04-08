const categoryService = require("@/services/category.service");
const asyncHandler = require("@/utils/asyncHandler");
const { sendSuccess } = require("@/utils/http");
const { requireNonEmptyString } = require("@/utils/validation");

const listCategories = asyncHandler(async (_req, res) => {
  const categories = await categoryService.listCategories();
  return sendSuccess(res, categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const name = requireNonEmptyString(req.body.name, "name");

  const category = await categoryService.createCategory({ name });
  return sendSuccess(res, category, 201);
});

module.exports = {
  listCategories,
  createCategory,
};
