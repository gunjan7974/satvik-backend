const Cart = require("../models/Cart");
const Food = require("../models/Food");   // ✅ ye missing tha

// 🛒 Add to Cart
exports.addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || !quantity) {
      res.status(400);
      throw new Error("Food ID and quantity required");
    }

    const food = await Food.findById(foodId);

    if (!food) {
      res.status(404);
      throw new Error("Food not found");
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
      } else {
        // 🟢 नहीं है → नया add करो
        cart.items.push({ food: foodId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);

  } catch (error) {
    next(error);
  }
};

// ➕➖ Update Quantity
exports.updateQuantity = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { action } = req.body; // increase / decrease

    if (!['increase', 'decrease'].includes(action)) {
      res.status(400);
      throw new Error("Invalid action. Use 'increase' or 'decrease'");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (!item) {
      res.status(404);
      throw new Error("Item not found in cart");
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
    next(error);
  }
};

// 📦 Get My Cart
exports.getMyCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.food");

    res.json(cart || { items: [] });
  } catch (error) {
    next(error);
  }
};

// ❌ Remove Item From Cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    // item remove
    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    await cart.save();

    res.json({ success: true, items: cart.items });

  } catch (error) {
    next(error);
  }
};

// 🧹 Clear Cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

// 🛒 Get All Carts (Admin Only)
exports.getAllCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find()
      .populate("user", "name email phone")
      .populate("items.food");

    res.json(carts);
  } catch (error) {
    next(error);
  }
};