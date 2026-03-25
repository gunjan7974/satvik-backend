const Order = require("../models/Order");
const Cart = require("../models/Cart");

// 🟢 Create Order
exports.createOrder = async (req, res) => {
  try {

    // 🔥 IMPORTANT: Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required. Please login to place an order." 
      });
    }

    // ⭐ DIRECT ORDER (Add button)
    if (req.body.orderItems && req.body.orderItems.length > 0) {

      const { orderItems, totalPrice } = req.body;

      // Validate order items
      if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "Order items are required" 
        });
      }

      const order = await Order.create({
        user: req.user._id,
        orderItems,
        totalPrice: totalPrice || 0,
        isPaid: false,
        status: "Pending"
      });

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order
      });
    }

    // ⭐ CART ORDER
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Cart is empty" 
      });
    }

    let totalPrice = 0;

    const orderItems = cart.items.map(item => {
      if (!item.food || !item.food.price) {
        throw new Error("Invalid food item in cart");
      }
      totalPrice += item.food.price * item.quantity;

      return {
        food: item.food._id,
        quantity: item.quantity
      };
    });

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
      isPaid: false,
      status: "Pending"
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully from cart",
      order
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    
    // Handle specific errors
    if (error.message === "Invalid food item in cart") {
      return res.status(400).json({ 
        success: false,
        message: "Some items in your cart are no longer available" 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Server Error. Please try again." 
    });
  }
};

// 🟢 Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("orderItems.food")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};  

// 🟢 Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    // 🔥 Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.food")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.log("GET MY ORDERS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// 🟢 Admin - Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // Validate status
    const validStatuses = ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// 🟢 Admin - Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.log("DELETE ORDER ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};