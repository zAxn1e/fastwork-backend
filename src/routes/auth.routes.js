const express = require("express");
const authController = require("@/controllers/auth.controller");
const requireJwtAuth = require("@/middlewares/requireJwtAuth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", requireJwtAuth, authController.logout);
router.get("/me", requireJwtAuth, authController.me);

module.exports = router;
