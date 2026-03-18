const Cart = require("../models/Cart");
const Food = require("../models/Food");   // ✅ ye missing tha

// 🛒 Add to Cart
exports.addToCart = async (req, res) => {
  try {

    const { foodId, quantity } = req.body;

    if (!foodId || !quantity) {
      return res.status(400).json({ message: "Food ID and quantity required" });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    // 🟢 Cart create if not exists
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ food: foodId, quantity }],
      });

    } else {

      const existingItem = cart.items.find(
        (item) => item.food.toString() === foodId
      );

      // 🟢 अगर item already है → quantity बढ़ाओ
      if (existingItem) {
        existingItem.quantity += quantity;
      } 
      
      // 🟢 नहीं है → नया add करो
      else {
        cart.items.push({ food: foodId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);

  } catch (error) {
    console.log("CART ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ➕➖ Update Quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { action } = req.body; // increase / decrease

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (action === "increase") {
      item.quantity += 1;
    }

    if (action === "decrease") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.food.toString() !== foodId
        );
      }
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.log("UPDATE QUANTITY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 📦 Get My Cart
exports.getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.food");

    res.json(cart);
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ❌ Remove Item From Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // item remove
    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    await cart.save();

    res.json({ success: true, items: cart.items });

  } catch (error) {
    console.log("REMOVE CART ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};