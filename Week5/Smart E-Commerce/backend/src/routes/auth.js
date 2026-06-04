// backend/src/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSession } = require("../middleware/auth");

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

// Protected routes
router.get("/profile", validateSession, authController.getProfile);
router.post("/refresh-session", validateSession, authController.refreshSession);

module.exports = router;
