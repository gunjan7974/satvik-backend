const express = require("express");
const router = express.Router();

const {
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Admin Routes
router.post("/", protect, admin, addFood);
router.put("/:id", protect, admin, updateFood);
router.delete("/:id", protect, admin, deleteFood);

module.exports = router;
