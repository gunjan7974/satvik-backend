const mongoose = require("mongoose");

const extraServiceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["fixed", "per_guest", "per_hour"],
    default: "fixed",
  },
  image: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("ExtraService", extraServiceSchema);