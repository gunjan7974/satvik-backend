const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  getUserProfile,
  updateProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

module.exports = router;