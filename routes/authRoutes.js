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
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage });

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single('avatar'), updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

module.exports = router;