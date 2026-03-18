const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { 
  addToCart, 
  getMyCart, 
  removeFromCart,
  updateQuantity
} = require("../controllers/cartController");

router.put("/:foodId", protect, updateQuantity);



router.delete("/:foodId", protect, removeFromCart);

router.post("/", protect, addToCart);
router.get("/", protect, getMyCart);

module.exports = router;
