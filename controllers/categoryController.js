const Category = require("../models/Category");

// ✅ GET
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ POST
exports.createCategory = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    const category = new Category({
      title,
      description,
      isActive
    });

    await category.save();

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};