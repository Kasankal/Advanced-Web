const express = require("express");
const router = express.Router();

// GET cart
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cart endpoint - coming soon",
    cart: [],
  });
});

// ADD to cart
router.post("/add", (req, res) => {
  res.json({
    success: true,
    message: "Add to cart - coming soon",
  });
});

module.exports = router;
