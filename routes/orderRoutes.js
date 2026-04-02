const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getOrderById
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// Create Order
router.post("/", protect, createOrder);

// Get My Orders
router.get("/my", protect, getMyOrders);

// Get Single Order By ID
router.get("/:id", protect, getOrderById);

// Get All Orders (Admin)
router.get("/", protect, admin, getAllOrders);

// Update Order Status (Admin Only)
router.patch("/:id/status", protect, admin, updateOrderStatus);

// Delete Order (Admin Only)
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
