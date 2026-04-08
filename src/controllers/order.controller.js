const orderService = require("@/services/order.service");
const asyncHandler = require("@/utils/asyncHandler");
const { sendSuccess } = require("@/utils/http");
const {
  parseId,
  parseOptionalId,
  requireEnum,
  requireNonEmptyString,
  requirePositiveInt,
  optionalPositiveInt,
} = require("@/utils/validation");

const ORDER_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const listOrders = asyncHandler(async (req, res) => {
  const filters = {
    clientId: parseOptionalId(req.query.clientId, "clientId"),
    sellerId: parseOptionalId(req.query.sellerId, "sellerId"),
    status:
      req.query.status !== undefined
        ? requireEnum(req.query.status, "status", ORDER_STATUSES)
        : undefined,
  };

  const orders = await orderService.listOrders(filters);
  return sendSuccess(res, orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const order = await orderService.getOrderById(id);
  return sendSuccess(res, order);
});

const createOrder = asyncHandler(async (req, res) => {
  const gigId = requirePositiveInt(req.body.gigId, "gigId");
  const clientId = requirePositiveInt(req.body.clientId, "clientId");
  const agreedPrice = optionalPositiveInt(req.body.agreedPrice, "agreedPrice");

  const payload = {
    gigId,
    clientId,
    agreedPrice,
    message:
      req.body.message !== undefined
        ? requireNonEmptyString(req.body.message, "message")
        : undefined,
  };

  const order = await orderService.createOrder(payload);
  return sendSuccess(res, order, 201);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const status = requireEnum(req.body.status, "status", ORDER_STATUSES);

  const updated = await orderService.updateOrderStatus(id, status);
  return sendSuccess(res, updated);
});

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
