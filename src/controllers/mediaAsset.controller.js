const asyncHandler = require("@/utils/asyncHandler");
const { sendSuccess } = require("@/utils/http");
const { parseId } = require("@/utils/validation");
const mediaAssetService = require("@/services/mediaAsset.service");

const uploadMediaAsset = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "file is required",
    });
  }

  const item = await mediaAssetService.createMediaAsset(req.auth.userId, req.file);
  return sendSuccess(res, item, 201);
});

const listMyMediaAssets = asyncHandler(async (req, res) => {
  const items = await mediaAssetService.listMyMediaAssets(req.auth.userId);
  return sendSuccess(res, items);
});

const getMyMediaAssetById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const item = await mediaAssetService.getMyMediaAssetById(req.auth.userId, id);
  return sendSuccess(res, item);
});

const deleteMyMediaAsset = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await mediaAssetService.deleteMyMediaAsset(req.auth.userId, id);
  return sendSuccess(res, { message: "Media asset deleted" });
});

module.exports = {
  uploadMediaAsset,
  listMyMediaAssets,
  getMyMediaAssetById,
  deleteMyMediaAsset,
};
