const Food = require("../models/Food");

// GET all foods
exports.getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find();
    res.json(foods);
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

    res.json(food);
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

    food.name = req.body.name || food.name;
    food.price = req.body.price || food.price;
    food.category = req.body.category || food.category;
    food.description = req.body.description || food.description;
    food.image = req.body.image || food.image;

    const updatedFood = await food.save();

    res.json(updatedFood);
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

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    next(error);
  }
};


// POST add food
exports.addFood = async (req, res, next) => {
  const { name, price, image, description, category, eventType } = req.body;

  try {
    const food = await Food.create({
      name,
      price,
      image,
      description,
      category,
      eventType
    });

    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};
