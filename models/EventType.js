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
});

module.exports = mongoose.model("EventType", eventTypeSchema);