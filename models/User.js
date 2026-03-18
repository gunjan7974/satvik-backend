const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {          // ✅ ADD THIS
      type: String,
    },
    avatar: {
      type: String,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);