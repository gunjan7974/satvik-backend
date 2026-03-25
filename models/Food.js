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
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Required false since not all items might belong to an event
    eventType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);