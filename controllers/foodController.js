const Food = require("../models/Food");

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
