const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  updateUserRole
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

// Get all users
router.get("/", protect, admin, getAllUsers);

// Delete user
router.delete("/:id", protect, admin, deleteUser);

// Update role
router.put("/:id/role", protect, admin, updateUserRole);

module.exports = router;