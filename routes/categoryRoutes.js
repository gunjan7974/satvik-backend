const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const upload = require("../middleware/upload");

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", upload.single("image"), createCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;