const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// Create Order
router.post("/", protect, createOrder);

// Get My Orders
router.get("/my", protect, getMyOrders);

// Get All Orders (Admin)
router.get("/", protect, admin, getAllOrders);

// Update Order Status (Admin Only)
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
