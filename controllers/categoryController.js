const Category = require("../models/Category");

// ✅ GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ POST create category
exports.createCategory = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const category = new Category({
      title,
      description,
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : true
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PUT update category
exports.updateCategory = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.title = title || category.title;
    category.description = description !== undefined ? description : category.description;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    await category.save();

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};