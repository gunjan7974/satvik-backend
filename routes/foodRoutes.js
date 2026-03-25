const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const { protect, admin } = require("../middleware/authMiddleware");

// Multer setup for parsing FormData
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

// Public Routes
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Admin Routes - Using upload.single('image') to parse FormData even if no image is sent
router.post("/", protect, admin, upload.single('image'), addFood);
router.put("/:id", protect, admin, upload.single('image'), updateFood);
router.delete("/:id", protect, admin, deleteFood);

module.exports = router;
