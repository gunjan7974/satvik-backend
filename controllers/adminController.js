const Order = require("../models/Order");
const User = require("../models/User");
const EventBooking = require("../models/EventBooking");
const Blog = require("../models/Blog");
const Food = require("../models/Food");

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalOrders = await Order.countDocuments();
    
    // Revenue from orders
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    // Revenue from events
    const eventBookings = await EventBooking.find();
    const totalEventRevenue = eventBookings.reduce((acc, eb) => acc + (eb.totalAmount || 0), 0);

    // Blog engagement
    const blogs = await Blog.find();
    const totalBlogViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);

    // Popular Items (Simple count)
    const totalMenuItems = await Food.countDocuments();

    // Recent data
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue,
        totalEventRevenue,
        totalBlogViews,
        totalMenuItems,
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };
