const express = require("express");
const orderController = require("@/controllers/order.controller");

const router = express.Router();

router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
