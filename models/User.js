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

    phone: {
      type: String,
    },

    avatar: {
      type: String,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    // ✅ ADD ROLE
    role: {
      type: String,
      enum: ["user", "vendor", "admin", "sales"],
      default: "user",
    },

    // ✅ VENDOR INFO
    vendorInfo: {
      businessName: String,
      businessAddress: String,
      phone: String,
      description: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);