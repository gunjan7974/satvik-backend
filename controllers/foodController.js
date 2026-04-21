const Food = require("../models/Food");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

// Helper function to map Food model to Frontend Menu interface
const mapFoodToMenu = (food) => {
  const f = food.toObject ? food.toObject() : food;
  return {
    ...f,
    title: f.name, // Frontend expects 'title'
    id: f._id
  };
};

// GET all foods
exports.getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find();
    
    // Map each food to include 'title'
    const menus = foods.map(mapFoodToMenu);

    res.json({
      success: true,
      menus: menus // Frontend expects 'menus' key
    });
  } catch (error) {
    next(error);
  }
};

// GET single food
exports.getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      res.status(404);
      throw new Error("Food not found");
    }

    res.json({
      success: true,
      data: mapFoodToMenu(food)
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      res.status(404);
      throw new Error("Food not found");
    }

    const { name, title, price, description, category, isAvailable, eventType } = req.body;

    food.name = name || title || food.name;
    food.price = price || food.price;
    food.category = category || food.category;
    food.description = description || food.description;
    food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;
    food.eventType = eventType || food.eventType;

    if (req.file) {
      food.image = `/uploads/${req.file.filename}`;
    } else {
      food.image = req.body.image || food.image;
    }

    const updatedFood = await food.save();

    res.json({
      success: true,
      data: mapFoodToMenu(updatedFood)
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      res.status(404);
      throw new Error("Food not found");
    }

    await food.deleteOne();

    res.json({ success: true, message: "Food deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST add food
exports.addFood = async (req, res, next) => {
  const { name, title, price, description, category, eventType, isAvailable } = req.body;

  try {
    let imageUrl = req.body.image || "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const food = await Food.create({
      name: name || title,
      price: Number(price),
      image: imageUrl,
      description,
      category,
      eventType: eventType || undefined,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    res.status(201).json({
      success: true,
      data: mapFoodToMenu(food)
    });
  } catch (error) {
    console.error("ADD FOOD ERROR:", error.message);
    next(error);
  }
};

// ✅ POST upload XML foods
exports.uploadXMLFoods = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("FOOD XML FILE RECEIVED:", req.file);
    const xmlData = fs.readFileSync(req.file.path, "utf-8");
    console.log("XML DATA LENGTH:", xmlData.length);

    // Fetch all categories to map names to IDs
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      if (cat.title) {
        const titleKey = String(cat.title).toLowerCase();
        categoryMap[titleKey] = cat._id;
      }
    });

    // Simple XML parser
    const parseSimpleXML = (xml) => {
      const result = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml)) !== null) {
        const content = match[1];
        const item = {};
        
        const nameMatch = content.match(/<name>([\s\S]*?)<\/name>/);
        const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
        const priceMatch = content.match(/<price>([\s\S]*?)<\/price>/);
        const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
        const catMatch = content.match(/<categoryName>([\s\S]*?)<\/categoryName>/);
        const availableMatch = content.match(/<isAvailable>([\s\S]*?)<\/isAvailable>/);

        item.name = String(nameMatch ? nameMatch[1] : (titleMatch ? titleMatch[1] : "")).trim();
        item.price = priceMatch ? Number(String(priceMatch[1]).trim()) : 0;
        item.description = descMatch ? String(descMatch[1]).trim() : "";
        item.categoryName = catMatch ? String(catMatch[1]).trim() : "";
        item.isAvailable = availableMatch ? String(availableMatch[1]).trim().toLowerCase() === "true" : true;
        
        if (item.name) result.push(item);
      }
      return result;
    };

    const foodsData = parseSimpleXML(xmlData);
    console.log("PARSED FOODS COUNT:", foodsData.length);

    if (foodsData.length === 0) {
      return res.status(400).json({ success: false, message: "No valid menu items found in XML" });
    }

    let insertedCount = 0;

    for (const data of foodsData) {
      // Map category name to ID
      let categoryId = "";
      if (data.categoryName) {
        const catKey = String(data.categoryName).toLowerCase();
        categoryId = categoryMap[catKey] || "";
      }

      await Food.create({
        name: data.name,
        price: data.price,
        description: data.description,
        category: categoryId ? categoryId.toString() : "",
        isAvailable: data.isAvailable
      });
      insertedCount++;
    }

    // Clean up uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({
      success: true,
      message: `Successfully processed XML. Inserted: ${insertedCount}`,
      data: { inserted: insertedCount }
    });

  } catch (error) {
    console.error("XML Upload Error:", error);
    next(error);
  }
};
