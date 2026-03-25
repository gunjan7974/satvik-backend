const mongoose = require("mongoose");

const eventTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("EventType", eventTypeSchema);