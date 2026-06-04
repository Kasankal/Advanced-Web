const express = require("express");
const router = express.Router();

// GET all products
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Products endpoint - coming soon",
    products: [],
  });
});

// GET single product
router.get("/:id", (req, res) => {
  res.json({
    success: true,
    message: "Get single product - coming soon",
  });
});

module.exports = router;
