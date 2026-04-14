const express = require("express");
const requireJwtAuth = require("@/middlewares/requireJwtAuth");
const requireAdmin = require("@/middlewares/requireAdmin");
const adminController = require("@/controllers/admin.controller");

const router = express.Router();

router.use(requireJwtAuth, requireAdmin);

router.get("/summary", adminController.getSummary);

router.get("/users", adminController.listUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/categories", adminController.listCategories);
router.post("/categories", adminController.createCategory);
router.patch("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.get("/gigs", adminController.listGigs);
router.get("/gigs/:id", adminController.getGigById);
router.patch("/gigs/:id", adminController.updateGig);
router.delete("/gigs/:id", adminController.deleteGig);

router.get("/orders", adminController.listOrders);
router.get("/orders/:id", adminController.getOrderById);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

router.get("/reviews", adminController.listReviews);
router.get("/reviews/:id", adminController.getReviewById);
router.delete("/reviews/:id", adminController.deleteReview);

module.exports = router;
