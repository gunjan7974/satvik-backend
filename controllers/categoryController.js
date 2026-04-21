const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

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

// ✅ POST upload XML categories
exports.uploadXMLCategories = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("CATEGORY XML FILE RECEIVED:", req.file);
    const xmlData = fs.readFileSync(req.file.path, "utf-8");
    console.log("XML DATA LENGTH:", xmlData.length);
    
    // Simple XML parser
    const parseSimpleXML = (xml) => {
      const result = [];
      const categoryRegex = /<category>([\s\S]*?)<\/category>/g;
      let match;

      while ((match = categoryRegex.exec(xml)) !== null) {
        const content = match[1];
        const item = {};
        
        const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
        const activeMatch = content.match(/<isActive>([\s\S]*?)<\/isActive>/);

        if (titleMatch) item.title = String(titleMatch[1]).trim();
        if (descMatch) item.description = String(descMatch[1]).trim();
        if (activeMatch) item.isActive = String(activeMatch[1]).trim().toLowerCase() === "true";
        
        if (item.title) result.push(item);
      }
      return result;
    };

    const categoriesData = parseSimpleXML(xmlData);
    console.log("PARSED CATEGORIES COUNT:", categoriesData.length);

    if (categoriesData.length === 0) {
      return res.status(400).json({ success: false, message: "No valid category data found in XML" });
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const data of categoriesData) {
      const existing = await Category.findOne({ title: data.title });
      if (!existing) {
        await Category.create({
          title: data.title,
          description: data.description || "",
          isActive: data.isActive !== undefined ? data.isActive : true
        });
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    // Clean up uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({
      success: true,
      message: `Successfully processed XML. Inserted: ${insertedCount}, Skipped duplicates: ${skippedCount}`,
      data: { inserted: insertedCount, skipped: skippedCount }
    });

  } catch (error) {
    console.error("XML Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};