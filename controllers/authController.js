const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// =========================
// REGISTER USER
// =========================
exports.registerUser = async (req, res) => {
  try {
    let { name, email, password, phone, role, vendorInfo } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      vendorInfo: role === "vendor" ? vendorInfo : undefined,
    });

    console.log("CREATED USER ID:", user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance || 0,
        avatar: user.avatar || "",
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =========================
// LOGIN USER
// =========================
exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance || 0,
        avatar: user.avatar || "",
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =========================
// GET PROFILE (PROTECTED)
// =========================
exports.getUserProfile = async (req, res) => {
  try {

    console.log("GETTING PROFILE FOR USER ID:", req.user._id);
    const user = await User.findById(req.user._id).select("-password");
    console.log("USER FOUND IN HANDLER:", user ? user._id : "NOT FOUND");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance || 0,
        role: user.role,
        isAdmin: user.isAdmin,
        avatar: user.avatar || "",
      },
    });

  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =========================
// UPDATE PROFILE
// =========================
exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check email duplicate
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({
        email: req.body.email.toLowerCase(),
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      user.email = req.body.email.toLowerCase();
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        walletBalance: updatedUser.walletBalance || 0,
        avatar: updatedUser.avatar || "",
      },
      token: generateToken(updatedUser._id),
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =========================
// CHANGE PASSWORD
// =========================
exports.changePassword = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};