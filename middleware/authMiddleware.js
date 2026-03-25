const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    console.log("DECODED ID FROM TOKEN:", decoded.id);
    console.log("USER IN DATABASE:", user ? user._id : "NOT FOUND");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { protect, admin };