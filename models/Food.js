const mongoose = require("mongoose");

const foodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },

    // ✅ NEW FIELD (Add this)
    eventType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);