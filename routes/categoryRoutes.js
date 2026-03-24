const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory
} = require("../controllers/categoryController");

const upload = require("../middleware/upload"); // ✅ add

router.get("/", getCategories);
router.post("/", upload.single("image"), createCategory); // ✅ change

module.exports = router;