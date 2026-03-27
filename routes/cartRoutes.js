const express = require("express");
const router = express.Router();

const { 
  addToCart, 
  getMyCart, 
  removeFromCart,
  updateQuantity,
  getAllCarts,
  clearCart
} = require("../controllers/cartController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/all", protect, admin, getAllCarts);
router.put("/:foodId", protect, updateQuantity);



router.delete("/:foodId", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.post("/", protect, addToCart);
router.get("/", protect, getMyCart);

module.exports = router;
