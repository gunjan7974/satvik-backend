const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


// =========================
// REGISTER USER
// =========================
exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)
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

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance || 0,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// =========================
// GET PROFILE
// =========================
exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.log("PROFILE ERROR:", error);
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
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      walletBalance: updatedUser.walletBalance || 0,
      token: generateToken(updatedUser._id)
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
      return res.status(404).json({ message: "User not found" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully"
    });

  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// =========================
// 👑 Get All Users (Admin)
// =========================
exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    console.log("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// =========================
// 🗑 Delete User (Admin)
// =========================
exports.deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User removed successfully" });

  } catch (error) {
    console.log("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// =========================
// 🔄 Update User Role (Admin)
// =========================
exports.updateUserRole = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });

  } catch (error) {
    console.log("UPDATE USER ROLE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};