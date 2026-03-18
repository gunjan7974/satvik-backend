const Food = require("../models/Food");

// GET all foods
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET single food
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    food.name = req.body.name || food.name;
    food.price = req.body.price || food.price;
    food.category = req.body.category || food.category;
    food.description = req.body.description || food.description;
    food.image = req.body.image || food.image;

    const updatedFood = await food.save();

    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// POST add food
exports.addFood = async (req, res) => {
  const { name, price, image, description, category } = req.body;

  try {
    const food = await Food.create({
      name,
      price,
      image,
      description,
      category,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
